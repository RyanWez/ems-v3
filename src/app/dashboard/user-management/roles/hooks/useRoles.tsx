'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { UserRole, RolePermissions } from '../types/permissions';

export const useRoles = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all roles
  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/roles');

      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }

      const data = await response.json();
      setRoles(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch roles';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new role
  const createRole = async (roleData: {
    name: string;
    description: string;
    permissions: RolePermissions;
    color?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate required fields
      if (!roleData.name || !roleData.description || !roleData.permissions) {
        throw new Error('Missing required fields: name, description, and permissions are required');
      }

      console.log('Creating role with data:', {
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions,
        color: roleData.color || 'blue'
      });

      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || 'Failed to create role');
      }

      const newRole = await response.json();
      console.log('Role created successfully:', newRole);
      setRoles(prev => [...prev, newRole]);
      toast.success(`Role "${roleData.name}" created successfully!`);
      return newRole;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create role';
      console.error('Create role error:', err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a role
  const updateRole = async (id: number, roleData: {
    name?: string;
    description?: string;
    permissions?: RolePermissions;
    color?: string;
    status?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/roles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update role');
      }

      const updatedRole = await response.json();
      setRoles(prev => prev.map(role => role.id === id ? updatedRole : role));
      toast.success(`Role "${updatedRole.name}" updated successfully!`);
      return updatedRole;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update role';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a role
  const deleteRole = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/roles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete role');
      }

      setRoles(prev => prev.filter(role => role.id !== id));
      toast.success('Role deleted successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete role';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update role permissions
  const updateRolePermissions = async (roleId: number, permissions: RolePermissions) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update role permissions');
      }

      const updatedRole = await response.json();
      setRoles(prev => prev.map(role => role.id === roleId ? updatedRole : role));
      toast.success('Role permissions updated successfully!');
      return updatedRole;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update role permissions';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    isLoading,
    error,
    createRole,
    updateRole,
    deleteRole,
    updateRolePermissions,
    refetch: fetchRoles
  };
};