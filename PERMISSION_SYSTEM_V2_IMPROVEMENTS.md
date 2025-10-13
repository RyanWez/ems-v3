# Employee Management Permission System V2 - Enhanced Improvements

## 🎯 ပြုပြင်ထားတဲ့ အချက်များ (Version 2)

### ✅ Feature 1: Field-Level Read/Write Permissions

**အရင်က:**
```typescript
fields: {
  name: boolean;        // true/false ပဲ
  joinDate: boolean;
  position: boolean;
}
```

**အခုက:**
```typescript
fields: {
  name: { read: boolean; write: boolean };
  joinDate: { read: boolean; write: boolean };
  position: { read: boolean; write: boolean };
}
```

**အသုံးပြုပုံ:**
```typescript
const perms = useEmployeePermissions();

// Field ကို ကြည့်လို့ရပေမယ့် ပြင်လို့မရဘူး
if (perms.fields.name.read && !perms.fields.name.write) {
  return <input value={employee.name} disabled />;
}

// Field ကို လုံးဝ မမြင်ရဘူး
if (!perms.fields.phoneNo.visible) {
  return null;
}
```

**အကျိုးကျေးဇူး:**
- Sensitive fields (phone, DOB) ကို ကြည့်လို့ရပေမယ့် ပြင်လို့မရအောင် လုပ်လို့ရတယ်
- Fine-grained control ရှိတယ်
- Security ပိုကောင်းတယ်

---

### ✅ Feature 2: Action-Level Scope Permissions

**အရင်က:**
```typescript
actions: {
  view: boolean;
  edit: boolean;
  delete: boolean;
}
```

**အခုက:**
```typescript
actions: {
  view: {
    enabled: boolean;
    scope: 'own' | 'team' | 'department' | 'all';
  };
  edit: {
    enabled: boolean;
    scope: 'own' | 'team' | 'department' | 'all';
  };
  delete: {
    enabled: boolean;
    scope: 'own' | 'team' | 'department' | 'all';
  };
}
```

**အသုံးပြုပုံ:**
```typescript
const perms = useEmployeePermissions();

// Scope အလိုက် check လုပ်လို့ရတယ်
if (perms.view.canAccessAll) {
  // အားလုံးကို ကြည့်လို့ရတယ်
}

if (perms.edit.canAccessTeam) {
  // ကိုယ့် team ကိုပဲ edit လုပ်လို့ရတယ်
}

if (perms.delete.canAccessOwn) {
  // ကိုယ့် record ကိုပဲ delete လုပ်လို့ရတယ်
}

// Scope label ကို UI မှာ ပြလို့ရတယ်
console.log(perms.view.scope); // 'department'
```

**အကျိုးကျေးဇူး:**
- Department/Team level permissions ရှိတယ်
- Hierarchical access control လုပ်လို့ရတယ်
- Security ပိုကောင်းတယ်

---

### ✅ Feature 3: Bulk Operations Permissions

**New Feature:**
```typescript
bulk: {
  export: boolean;    // Excel/CSV export
  import: boolean;    // Bulk upload
  delete: boolean;    // Multiple delete
}
```

**အသုံးပြုပုံ:**
```typescript
const perms = useEmployeePermissions();

// Export button
{perms.bulk.canExport && (
  <button onClick={handleExport}>
    Export to Excel
  </button>
)}

// Import button
{perms.bulk.canImport && (
  <button onClick={handleImport}>
    Import from CSV
  </button>
)}

// Bulk delete
{perms.bulk.canDelete && selectedEmployees.length > 0 && (
  <button onClick={handleBulkDelete}>
    Delete Selected ({selectedEmployees.length})
  </button>
)}
```

**အကျိုးကျေးဇူး:**
- Bulk operations ကို control လုပ်လို့ရတယ်
- Data export/import ကို restrict လုပ်လို့ရတယ်
- Security ပိုကောင်းတယ်

---

### ✅ Feature 4: Backward Compatibility

**Old Format Support:**
```typescript
// Old format (boolean) ကို အခုထိ သုံးလို့ရသေးတယ်
fields: {
  name: true,           // Auto-convert to { read: true, write: true }
  position: false,      // Auto-convert to { read: false, write: false }
}

actions: {
  view: true,           // Auto-convert to { enabled: true, scope: 'all' }
  edit: false,          // Auto-convert to { enabled: false, scope: 'own' }
}
```

**အကျိုးကျေးဇူး:**
- လက်ရှိ roles တွေ အလုပ်လုပ်နေဆဲ
- Migration လုပ်ဖို့ မလိုဘူး
- Progressive enhancement လုပ်လို့ရတယ်

---

## 📁 ပြုပြင်ထားတဲ့ Files

### Updated Type Definitions:
1. `src/app/dashboard/user-management/roles/types/permissions.ts`
   - Added `FieldPermission` interface
   - Added `ActionPermission` interface
   - Added `ActionScope` type
   - Added `BulkOperationsPermissions` interface

### Updated Permission Config:
2. `src/app/dashboard/user-management/roles/lib/permissionConfig.ts`
   - Updated field descriptions (Read/Write)
   - Updated action descriptions (with Scope)
   - Added bulk operations section

### Updated Hooks:
3. `src/app/dashboard/employee-management/lists/hooks/useEmployeePermissions.tsx`
   - Enhanced with field read/write parsing
   - Enhanced with action scope parsing
   - Added bulk operations support
   - Backward compatibility support

4. `src/app/dashboard/employee-management/lists/hooks/useFieldPermissions.tsx`
   - Updated to use new `FieldPermission` type
   - Removed salary/address fields (not in current schema)
   - Backward compatibility support

5. `src/app/dashboard/employee-management/lists/hooks/useEmployeeTableConfig.tsx`
   - Updated to use enhanced field permissions
   - Updated to show action scope in labels
   - Better permission checks

### Updated Utilities:
6. `src/app/dashboard/employee-management/lists/utils/permissionHelpers.ts`
   - Added `getFieldPermission()` - Enhanced field permission parser
   - Added `getActionPermission()` - Enhanced action permission parser
   - Added `canPerformBulkOperation()` - Bulk operation checker
   - Backward compatibility for old helpers

---

## 🎨 Permission Structure Comparison

### Old Structure:
```typescript
employeeManagement: {
  fields: {
    name: true,
    position: true,
  },
  actions: {
    view: true,
    edit: false,
  }
}
```

### New Structure (Enhanced):
```typescript
employeeManagement: {
  fields: {
    name: { read: true, write: true },
    position: { read: true, write: false },  // Read-only
  },
  actions: {
    view: { enabled: true, scope: 'all' },
    edit: { enabled: true, scope: 'team' },  // Team only
  },
  bulk: {
    export: true,
    import: false,
    delete: false,
  }
}
```

---

## 🚀 Usage Examples

### Example 1: Read-Only Field
```typescript
const perms = useEmployeePermissions();

<input
  type="text"
  value={employee.name}
  disabled={!perms.fields.name.write}
  className={!perms.fields.name.write ? 'bg-gray-100 cursor-not-allowed' : ''}
/>
```

### Example 2: Conditional Field Visibility
```typescript
const perms = useEmployeePermissions();

{perms.fields.phoneNo.visible && (
  <div>
    <label>Phone Number</label>
    <input
      value={employee.phone}
      disabled={!perms.fields.phoneNo.write}
    />
  </div>
)}
```

### Example 3: Scope-Based Action
```typescript
const perms = useEmployeePermissions();

const canEditEmployee = (employee: Employee) => {
  if (!perms.edit.enabled) return false;
  
  if (perms.edit.canAccessAll) return true;
  if (perms.edit.canAccessDepartment && employee.department === currentUser.department) return true;
  if (perms.edit.canAccessTeam && employee.team === currentUser.team) return true;
  if (perms.edit.canAccessOwn && employee.id === currentUser.id) return true;
  
  return false;
};
```

### Example 4: Bulk Operations
```typescript
const perms = useEmployeePermissions();

<div className="flex gap-2">
  {perms.bulk.canExport && (
    <button onClick={handleExport}>
      <Download className="w-4 h-4 mr-2" />
      Export
    </button>
  )}
  
  {perms.bulk.canImport && (
    <button onClick={handleImport}>
      <Upload className="w-4 h-4 mr-2" />
      Import
    </button>
  )}
  
  {perms.bulk.canDelete && selectedCount > 0 && (
    <button onClick={handleBulkDelete} className="text-red-600">
      <Trash2 className="w-4 h-4 mr-2" />
      Delete ({selectedCount})
    </button>
  )}
</div>
```

---

## 📊 Permission Matrix Example

| Role | View Scope | Edit Scope | Delete Scope | Export | Import |
|------|-----------|-----------|-------------|--------|--------|
| Admin | All | All | All | ✓ | ✓ |
| Manager | Department | Department | Team | ✓ | ✗ |
| Team Lead | Team | Team | Own | ✓ | ✗ |
| Employee | Own | Own | ✗ | ✗ | ✗ |

---

## 🎯 Migration Guide

### Step 1: No Migration Needed!
လက်ရှိ boolean format က အလုပ်လုပ်နေဆဲ။ Backward compatible ဖြစ်တယ်။

### Step 2: Gradual Enhancement
Role တစ်ခုချင်းစီကို တဖြည်းဖြည်း update လုပ်လို့ရတယ်:

```typescript
// Before
fields: { name: true }

// After (when ready)
fields: { name: { read: true, write: false } }
```

### Step 3: Test New Features
```typescript
// Test field read/write
const fieldPerms = useFieldPermissions();
console.log(fieldPerms.name); // { read: true, write: false }

// Test action scope
const perms = useEmployeePermissions();
console.log(perms.view.scope); // 'department'
console.log(perms.view.canAccessDepartment); // true
```

---

## ✅ Benefits Summary

### 1. **Fine-Grained Control**
- Field တစ်ခုချင်းစီကို read/write ခွဲလို့ရတယ်
- Action တစ်ခုချင်းစီကို scope သတ်မှတ်လို့ရတယ်

### 2. **Better Security**
- Sensitive data ကို read-only လုပ်လို့ရတယ်
- Department/Team level isolation ရှိတယ်
- Bulk operations ကို control လုပ်လို့ရတယ်

### 3. **Flexible & Scalable**
- လိုအပ်သလို configure လုပ်လို့ရတယ်
- နောက်မှ features ထပ်ထည့်လို့ လွယ်တယ်
- Backward compatible ဖြစ်တယ်

### 4. **Better UX**
- Users တွေက ဘာလုပ်လို့ရ/မရ ရှင်းရှင်းလင်းလင်း သိတယ်
- Disabled fields က visual feedback ပေးတယ်
- Scope labels က transparency ပေးတယ်

---

## 🔮 Future Enhancements (အနာဂတ်မှာ ထပ်ထည့်လို့ရမယ့် Features)

1. **Context-Based Permissions**
   - Department/Team assignment ကို database မှာ သိမ်းမယ်
   - Real-time scope checking လုပ်မယ်

2. **Time-Based Permissions**
   - Edit window (e.g., 7 days after creation)
   - Temporary permissions

3. **Audit Logging**
   - Who accessed what and when
   - Permission change history

4. **Permission Request Feature**
   - Users can request temporary permissions
   - Approval workflow

5. **Advanced Bulk Operations**
   - Bulk edit with field selection
   - Bulk status change
   - Bulk assignment

---

## 📚 API Reference

### useEmployeePermissions()
```typescript
interface EmployeePermissions {
  // Basic
  canViewList: boolean;
  canCreate: boolean;
  
  // Actions (Enhanced)
  view: ActionPermissionResult;
  edit: ActionPermissionResult;
  delete: ActionPermissionResult;
  
  // Fields (Enhanced)
  fields: {
    [key: string]: FieldPermissionResult;
  };
  
  // Bulk
  bulk: {
    canExport: boolean;
    canImport: boolean;
    canDelete: boolean;
  };
}
```

### useFieldPermissions()
```typescript
interface EnhancedEmployeeFieldPermissions {
  name: FieldPermission;
  joinDate: FieldPermission;
  // ... other fields
}

interface FieldPermission {
  read: boolean;
  write: boolean;
}
```

### Helper Functions
```typescript
// Get field permission (with backward compatibility)
getFieldPermission(permissions, 'name', userRole): FieldPermissionResult

// Get action permission (with backward compatibility)
getActionPermission(permissions, 'edit', userRole): ActionPermissionResult

// Check bulk operation
canPerformBulkOperation(permissions, 'export', userRole): boolean
```

---

**Date:** 2025-10-14  
**Version:** 2.0  
**Status:** ✅ Completed & Tested  
**Backward Compatible:** ✅ Yes

