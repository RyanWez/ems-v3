# Permission System V2 - Usage Examples

## 📚 အသုံးပြုပုံ လမ်းညွှန်

### 1. Basic Permission Check

```typescript
import { useEmployeePermissions } from './hooks/useEmployeePermissions';

function EmployeeListPage() {
  const perms = useEmployeePermissions();
  
  // Check if user can view the list
  if (!perms.canViewList) {
    return <AccessDenied />;
  }
  
  return (
    <div>
      <h1>Employee List</h1>
      
      {/* Show create button only if user has permission */}
      {perms.canCreate && (
        <button onClick={handleCreate}>
          Add New Employee
        </button>
      )}
      
      <EmployeeTable />
    </div>
  );
}
```

---

### 2. Field-Level Read/Write Permissions

```typescript
import { useFieldPermissions } from './hooks/useFieldPermissions';

function EmployeeForm({ employee, onSave }) {
  const fieldPerms = useFieldPermissions();
  
  return (
    <form onSubmit={onSave}>
      {/* Name field - Check if visible and editable */}
      {fieldPerms.name.read && (
        <div>
          <label>Name</label>
          <input
            type="text"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            disabled={!fieldPerms.name.write}
            className={!fieldPerms.name.write ? 'bg-gray-100 cursor-not-allowed' : ''}
          />
          {!fieldPerms.name.write && (
            <p className="text-xs text-gray-500">Read-only field</p>
          )}
        </div>
      )}
      
      {/* Phone field - Might be hidden completely */}
      {fieldPerms.phoneNo.read && (
        <div>
          <label>Phone Number</label>
          <input
            type="tel"
            value={employee.phone}
            onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
            disabled={!fieldPerms.phoneNo.write}
          />
        </div>
      )}
      
      {/* Position - Read-only for some roles */}
      {fieldPerms.position.read && (
        <div>
          <label>Position</label>
          {fieldPerms.position.write ? (
            <select
              value={employee.position}
              onChange={(e) => setEmployee({ ...employee, position: e.target.value })}
            >
              <option>Developer</option>
              <option>Designer</option>
              <option>Manager</option>
            </select>
          ) : (
            <input
              type="text"
              value={employee.position}
              disabled
              className="bg-gray-100"
            />
          )}
        </div>
      )}
    </form>
  );
}
```

---

### 3. Action Scope-Based Permissions

```typescript
import { useEmployeePermissions } from './hooks/useEmployeePermissions';
import { useAuth } from '@/Auth/AuthContext';

function EmployeeTable({ employees }) {
  const perms = useEmployeePermissions();
  const { user } = useAuth();
  
  // Check if user can perform action on specific employee
  const canEditEmployee = (employee: Employee) => {
    if (!perms.edit.enabled) return false;
    
    // Check scope
    if (perms.edit.canAccessAll) return true;
    if (perms.edit.canAccessDepartment && employee.department === user.department) return true;
    if (perms.edit.canAccessTeam && employee.team === user.team) return true;
    if (perms.edit.canAccessOwn && employee.id === user.id) return true;
    
    return false;
  };
  
  const canDeleteEmployee = (employee: Employee) => {
    if (!perms.delete.enabled) return false;
    
    if (perms.delete.canAccessAll) return true;
    if (perms.delete.canAccessDepartment && employee.department === user.department) return true;
    if (perms.delete.canAccessTeam && employee.team === user.team) return true;
    if (perms.delete.canAccessOwn && employee.id === user.id) return true;
    
    return false;
  };
  
  return (
    <table>
      <tbody>
        {employees.map(employee => (
          <tr key={employee.id}>
            <td>{employee.name}</td>
            <td>{employee.position}</td>
            <td>
              {/* View button - Show scope in tooltip */}
              {perms.view.enabled && (
                <button
                  onClick={() => handleView(employee)}
                  title={`View (${perms.view.scope})`}
                >
                  View
                </button>
              )}
              
              {/* Edit button - Only show if user can edit this employee */}
              {canEditEmployee(employee) && (
                <button
                  onClick={() => handleEdit(employee)}
                  title={`Edit (${perms.edit.scope})`}
                >
                  Edit
                </button>
              )}
              
              {/* Delete button - Only show if user can delete this employee */}
              {canDeleteEmployee(employee) && (
                <button
                  onClick={() => handleDelete(employee)}
                  className="text-red-600"
                  title={`Delete (${perms.delete.scope})`}
                >
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### 4. Bulk Operations

```typescript
import { useEmployeePermissions } from './hooks/useEmployeePermissions';
import { Download, Upload, Trash2 } from 'lucide-react';

function EmployeeListToolbar({ selectedEmployees, onExport, onImport, onBulkDelete }) {
  const perms = useEmployeePermissions();
  
  return (
    <div className="flex gap-2 mb-4">
      {/* Export button */}
      {perms.bulk.canExport && (
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      )}
      
      {/* Import button */}
      {perms.bulk.canImport && (
        <button
          onClick={onImport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded"
        >
          <Upload className="w-4 h-4" />
          Import from CSV
        </button>
      )}
      
      {/* Bulk delete button - Only show when items are selected */}
      {perms.bulk.canDelete && selectedEmployees.length > 0 && (
        <button
          onClick={onBulkDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded"
        >
          <Trash2 className="w-4 h-4" />
          Delete Selected ({selectedEmployees.length})
        </button>
      )}
      
      {/* Show message if no bulk permissions */}
      {!perms.bulk.canExport && !perms.bulk.canImport && !perms.bulk.canDelete && (
        <p className="text-sm text-gray-500">
          No bulk operations available for your role
        </p>
      )}
    </div>
  );
}
```

---

### 5. Dynamic Table Configuration

```typescript
import { useEmployeeTableConfig } from './hooks/useEmployeeTableConfig';

function EmployeeTable({ employees }) {
  const tableConfig = useEmployeeTableConfig(
    handleView,
    handleEdit,
    handleDelete
  );
  
  return (
    <table>
      <thead>
        <tr>
          {/* Dynamically render column headers based on permissions */}
          {tableConfig.columns.map(col => (
            <th key={col.key} style={{ width: col.width }}>
              {col.label}
            </th>
          ))}
          
          {/* Action column - Only show if user has any action permission */}
          {tableConfig.hasActions && (
            <th style={{ width: tableConfig.actionWidth }}>
              ACTIONS
            </th>
          )}
        </tr>
      </thead>
      
      <tbody>
        {employees.map(employee => (
          <tr key={employee.id}>
            {/* Dynamically render cells based on visible columns */}
            {tableConfig.columns.map(col => {
              const value = employee[col.field];
              return (
                <td key={col.key}>
                  {col.render ? col.render(value, employee) : value}
                </td>
              );
            })}
            
            {/* Action buttons */}
            {tableConfig.hasActions && (
              <td>
                <div className="flex gap-2">
                  {tableConfig.actions.map(action => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.key}
                        onClick={() => action.onClick(employee)}
                        className={`p-2 rounded ${action.color} ${action.hoverColor}`}
                        title={action.label}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### 6. Permission-Based Navigation

```typescript
import { useEmployeePermissions } from './hooks/useEmployeePermissions';

function EmployeeManagementNav() {
  const perms = useEmployeePermissions();
  
  return (
    <nav>
      {/* Employee List - Always show if user can view */}
      {perms.canViewList && (
        <Link href="/employees">
          Employee List
        </Link>
      )}
      
      {/* Birthday View */}
      {perms.canViewBirthdays && (
        <Link href="/employees/birthdays">
          Birthdays
        </Link>
      )}
      
      {/* Leave Management */}
      {perms.leave.canView && (
        <Link href="/employees/leave">
          Leave Management
          {perms.leave.canApprove && (
            <span className="badge">Approver</span>
          )}
        </Link>
      )}
    </nav>
  );
}
```

---

### 7. Conditional Rendering with Multiple Checks

```typescript
import { useEmployeePermissions } from './hooks/useEmployeePermissions';

function EmployeeDetailsPage({ employee }) {
  const perms = useEmployeePermissions();
  
  // Check if user can view details page
  if (!perms.canViewDetails) {
    return <AccessDenied message="You don't have permission to view employee details" />;
  }
  
  return (
    <div>
      <h1>Employee Details</h1>
      
      {/* Personal Info Section */}
      {perms.detailsFields.personalInfo && (
        <section>
          <h2>Personal Information</h2>
          {perms.fields.name.visible && <p>Name: {employee.name}</p>}
          {perms.fields.dob.visible && <p>DOB: {employee.dob}</p>}
          {perms.fields.gender.visible && <p>Gender: {employee.gender}</p>}
        </section>
      )}
      
      {/* Contact Info Section */}
      {perms.detailsFields.contactInfo && (
        <section>
          <h2>Contact Information</h2>
          {perms.fields.phoneNo.visible && <p>Phone: {employee.phone}</p>}
        </section>
      )}
      
      {/* Work Info Section */}
      {perms.detailsFields.workInfo && (
        <section>
          <h2>Work Information</h2>
          {perms.fields.position.visible && <p>Position: {employee.position}</p>}
          {perms.fields.joinDate.visible && <p>Join Date: {employee.joinDate}</p>}
          {perms.fields.serviceYears.visible && (
            <p>Service Years: {calculateServiceYears(employee.joinDate)}</p>
          )}
        </section>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        {perms.canEdit && (
          <button onClick={handleEdit}>
            Edit Employee
          </button>
        )}
        
        {perms.canDelete && (
          <button onClick={handleDelete} className="text-red-600">
            Delete Employee
          </button>
        )}
      </div>
    </div>
  );
}
```

---

### 8. Helper Function for Complex Permission Logic

```typescript
import { useEmployeePermissions } from './hooks/useEmployeePermissions';
import { useAuth } from '@/Auth/AuthContext';

// Custom hook for employee-specific permission checks
export function useEmployeeActions(employee: Employee) {
  const perms = useEmployeePermissions();
  const { user } = useAuth();
  
  const canView = useMemo(() => {
    if (!perms.view.enabled) return false;
    if (perms.view.canAccessAll) return true;
    if (perms.view.canAccessDepartment && employee.department === user.department) return true;
    if (perms.view.canAccessTeam && employee.team === user.team) return true;
    if (perms.view.canAccessOwn && employee.id === user.id) return true;
    return false;
  }, [perms.view, employee, user]);
  
  const canEdit = useMemo(() => {
    if (!perms.edit.enabled) return false;
    if (perms.edit.canAccessAll) return true;
    if (perms.edit.canAccessDepartment && employee.department === user.department) return true;
    if (perms.edit.canAccessTeam && employee.team === user.team) return true;
    if (perms.edit.canAccessOwn && employee.id === user.id) return true;
    return false;
  }, [perms.edit, employee, user]);
  
  const canDelete = useMemo(() => {
    if (!perms.delete.enabled) return false;
    if (perms.delete.canAccessAll) return true;
    if (perms.delete.canAccessDepartment && employee.department === user.department) return true;
    if (perms.delete.canAccessTeam && employee.team === user.team) return true;
    if (perms.delete.canAccessOwn && employee.id === user.id) return true;
    return false;
  }, [perms.delete, employee, user]);
  
  return { canView, canEdit, canDelete };
}

// Usage
function EmployeeCard({ employee }) {
  const { canView, canEdit, canDelete } = useEmployeeActions(employee);
  
  return (
    <div className="employee-card">
      <h3>{employee.name}</h3>
      <div className="actions">
        {canView && <button onClick={() => handleView(employee)}>View</button>}
        {canEdit && <button onClick={() => handleEdit(employee)}>Edit</button>}
        {canDelete && <button onClick={() => handleDelete(employee)}>Delete</button>}
      </div>
    </div>
  );
}
```

---

### 9. Permission Summary Display

```typescript
import { useEmployeePermissions } from './hooks/useEmployeePermissions';

function PermissionSummary() {
  const perms = useEmployeePermissions();
  
  return (
    <div className="permission-summary">
      <h3>Your Permissions</h3>
      
      <div className="section">
        <h4>Basic Access</h4>
        <ul>
          <li>View List: {perms.canViewList ? '✓' : '✗'}</li>
          <li>Create Employee: {perms.canCreate ? '✓' : '✗'}</li>
        </ul>
      </div>
      
      <div className="section">
        <h4>Actions</h4>
        <ul>
          <li>
            View: {perms.view.enabled ? '✓' : '✗'}
            {perms.view.enabled && ` (Scope: ${perms.view.scope})`}
          </li>
          <li>
            Edit: {perms.edit.enabled ? '✓' : '✗'}
            {perms.edit.enabled && ` (Scope: ${perms.edit.scope})`}
          </li>
          <li>
            Delete: {perms.delete.enabled ? '✓' : '✗'}
            {perms.delete.enabled && ` (Scope: ${perms.delete.scope})`}
          </li>
        </ul>
      </div>
      
      <div className="section">
        <h4>Visible Fields ({perms.visibleFieldCount})</h4>
        <ul>
          {Object.entries(perms.fields).map(([field, perm]) => (
            <li key={field}>
              {field}: 
              {perm.visible ? (
                <>
                  Read: {perm.read ? '✓' : '✗'}, 
                  Write: {perm.write ? '✓' : '✗'}
                </>
              ) : '✗ Hidden'}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="section">
        <h4>Bulk Operations</h4>
        <ul>
          <li>Export: {perms.bulk.canExport ? '✓' : '✗'}</li>
          <li>Import: {perms.bulk.canImport ? '✓' : '✗'}</li>
          <li>Bulk Delete: {perms.bulk.canDelete ? '✓' : '✗'}</li>
        </ul>
      </div>
    </div>
  );
}
```

---

## 🎯 Best Practices

### 1. Always Check Permissions Early
```typescript
// ✓ Good
function EmployeePage() {
  const perms = useEmployeePermissions();
  
  if (!perms.canViewList) {
    return <AccessDenied />;
  }
  
  return <EmployeeList />;
}

// ✗ Bad - Checking too late
function EmployeePage() {
  const data = fetchEmployees(); // Already fetched data
  const perms = useEmployeePermissions();
  
  if (!perms.canViewList) {
    return <AccessDenied />;
  }
  
  return <EmployeeList data={data} />;
}
```

### 2. Use Memoization for Complex Checks
```typescript
// ✓ Good
const canEditEmployee = useMemo(() => {
  // Complex logic here
}, [perms, employee, user]);

// ✗ Bad - Recalculating on every render
const canEditEmployee = checkIfCanEdit(perms, employee, user);
```

### 3. Provide Visual Feedback
```typescript
// ✓ Good - Shows why field is disabled
<input
  disabled={!fieldPerms.name.write}
  className={!fieldPerms.name.write ? 'bg-gray-100 cursor-not-allowed' : ''}
  title={!fieldPerms.name.write ? 'You do not have permission to edit this field' : ''}
/>

// ✗ Bad - No feedback
<input disabled={!fieldPerms.name.write} />
```

### 4. Handle Missing Permissions Gracefully
```typescript
// ✓ Good
{perms.fields.phoneNo?.visible && <PhoneField />}

// ✗ Bad - Might crash if permission is undefined
{perms.fields.phoneNo.visible && <PhoneField />}
```

---

**Date:** 2025-10-14  
**Version:** 2.0  
**Status:** ✅ Ready to Use

