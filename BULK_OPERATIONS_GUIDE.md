# Bulk Operations - Implementation Guide

## 🎯 Overview

Bulk Operations permissions ကို Employee Management မှာ ထည့်သွင်းပြီးပါပြီ။ ဒီ feature က users တွေကို data export, import, နဲ့ bulk delete လုပ်ခွင့် ပေးတယ်။

---

## ✅ လက်ရှိ အခြေအနေ

### 1. **Export Operations (✅ Implemented)**

**Features:**
- Export to Excel (.xlsx)
- Export to CSV (.csv)
- Permission-based access control

**Code Location:**
```typescript
// File: src/app/dashboard/employee-management/lists/page.tsx

// Export handlers with permission check
const handleExportCSV = () => {
  if (!perms.bulk.canExport) {
    alert('You do not have permission to export data.');
    return;
  }
  exportEmployeesToCSV(filteredEmployees);
};

const handleExportExcel = () => {
  if (!perms.bulk.canExport) {
    alert('You do not have permission to export data.');
    return;
  }
  exportEmployeesToExcel(filteredEmployees);
};
```

**UI Display:**
```typescript
{/* Export buttons - Only show if user has export permission */}
{perms.bulk.canExport && (
  <>
    <button onClick={handleExportExcel}>
      <Download size={18} className="mr-2" />
      Export Excel
    </button>
    
    <button onClick={handleExportCSV}>
      <Download size={18} className="mr-2" />
      Export CSV
    </button>
  </>
)}
```

**Permission Check:**
- ✅ Permission မရှိရင် button မပေါ်ဘူး
- ✅ Function call မှာလည်း double-check လုပ်ထားတယ်
- ✅ Filtered employees ကိုပဲ export လုပ်တယ်

---

---

## 🔐 Permission Structure

### Database Schema (Prisma):
```typescript
// In Role model
permissions: Json  // Stored as JSON

// Example structure:
{
  employeeManagement: {
    bulk: {
      export: boolean
    }
  }
}
```

### TypeScript Types:
```typescript
// File: src/app/dashboard/user-management/roles/types/permissions.ts

export interface BulkOperationsPermissions {
  export: boolean;
}

export interface RolePermissions {
  employeeManagement: {
    // ... other permissions
    bulk: BulkOperationsPermissions;
  };
}
```

### Permission Config (UI Metadata):
```typescript
// File: src/app/dashboard/user-management/roles/lib/permissionConfig.ts

bulk: {
  title: 'Bulk Operations',
  permissions: {
    export: { 
      title: 'Export Data', 
      description: 'Can export employee list to Excel/CSV' 
    },
  },
}
```

---

## 🎨 UI Display

### Role Permission Editor:
```
┌─ Employee Management ─────────────────────────────┐
│                                                    │
│ Bulk Operations                        [ ] Select All │
│ ┌────────────────────────────────────────────────┐│
│ │ [ ] Export Data                                ││
│ │     Can export employee list to Excel/CSV      ││
│ └────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────┘
```

### Employee List Page:
```
┌─ Employee List ────────────────────────────────────┐
│                                                     │
│  [Export Excel] [Export CSV] [Add New Employee]    │  ← Only show if has permission
│                                                     │
│  Search: [________]  Position: [All ▼]             │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Name    | Position  | Join Date | Actions   │  │
│  ├─────────────────────────────────────────────┤  │
│  │ John    | Developer | 2023-01-15 | [V][E][D]│  │
│  │ Jane    | Designer  | 2023-02-20 | [V][E][D]│  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Permission Matrix

| Role | Export | Notes |
|------|--------|-------|
| Administrator | ✓ | Full access |
| Manager | ✓ | Can export |
| HR | ✓ | Can export |
| Team Lead | ✓ | Can export |
| Employee | ✗ | No export |

---

## 🔧 Implementation Details

### 1. Permission Check Flow

```typescript
// Step 1: Get permissions
const perms = useEmployeePermissions();

// Step 2: Check in UI (hide button if no permission)
{perms.bulk.canExport && (
  <button onClick={handleExport}>Export</button>
)}

// Step 3: Double-check in handler (security)
const handleExport = () => {
  if (!perms.bulk.canExport) {
    alert('No permission');
    return;
  }
  // Proceed with export
};
```

### 2. Default Permissions

**New Role (Default):**
```typescript
bulk: {
  export: false,
}
```

**Administrator Role:**
```typescript
bulk: {
  export: true,
}
```

---

## 🚀 Current Features

### Export Functionality (✅ Implemented)
- Export to Excel (.xlsx)
- Export to CSV (.csv)
- Permission-based access control
- Export filtered results
- Disabled when no data

---

## 📝 Usage Examples

### Example 1: Check Export Permission
```typescript
import { useEmployeePermissions } from './hooks/useEmployeePermissions';

function EmployeeToolbar() {
  const perms = useEmployeePermissions();
  
  return (
    <div>
      {perms.bulk.canExport && (
        <button onClick={handleExport}>
          Export Data
        </button>
      )}
      
      {!perms.bulk.canExport && (
        <p className="text-gray-500 text-sm">
          You don't have permission to export data
        </p>
      )}
    </div>
  );
}
```

### Example 2: Conditional Rendering
```typescript
function BulkOperationsMenu() {
  const perms = useEmployeePermissions();
  
  // Don't show menu at all if no bulk permissions
  if (!perms.bulk.canExport && !perms.bulk.canImport && !perms.bulk.canDelete) {
    return null;
  }
  
  return (
    <div className="bulk-menu">
      {perms.bulk.canExport && <ExportButton />}
      {perms.bulk.canImport && <ImportButton />}
      {perms.bulk.canDelete && <BulkDeleteButton />}
    </div>
  );
}
```

### Example 3: Permission Summary
```typescript
function PermissionSummary() {
  const perms = useEmployeePermissions();
  
  return (
    <div>
      <h4>Your Bulk Operations Permissions:</h4>
      <ul>
        <li>Export: {perms.bulk.canExport ? '✓ Allowed' : '✗ Denied'}</li>
        <li>Import: {perms.bulk.canImport ? '✓ Allowed' : '✗ Denied'}</li>
        <li>Bulk Delete: {perms.bulk.canDelete ? '✓ Allowed' : '✗ Denied'}</li>
      </ul>
    </div>
  );
}
```

---

## ✅ Testing Checklist

### Export Functionality:
- [x] Export button ပေါ်တယ် (permission ရှိရင်)
- [x] Export button မပေါ်ဘူး (permission မရှိရင်)
- [x] Excel export အလုပ်လုပ်တယ်
- [x] CSV export အလုပ်လုပ်တယ်
- [x] Filtered data ကိုပဲ export လုပ်တယ်
- [x] Empty list မှာ button disabled ဖြစ်တယ်

### Import Functionality:
- [ ] Import button ပေါ်တယ် (permission ရှိရင်)
- [ ] Import button မပေါ်ဘူး (permission မရှိရင်)
- [ ] File upload အလုပ်လုပ်တယ်
- [ ] Data validation အလုပ်လုပ်တယ်
- [ ] Import success feedback ပြတယ်
- [ ] Import error handling ကောင်းတယ်

### Bulk Delete:
- [ ] Checkbox column ပေါ်တယ် (permission ရှိရင်)
- [ ] Select all အလုပ်လုပ်တယ်
- [ ] Delete button ပေါ်တယ် (items selected ရှိရင်)
- [ ] Confirmation dialog ပြတယ်
- [ ] Bulk delete အလုပ်လုပ်တယ်
- [ ] Success feedback ပြတယ်

### Permission Checks:
- [x] Administrator က အားလုံး access ရတယ်
- [x] New role က default false ဖြစ်တယ်
- [x] Permission editor မှာ bulk section ပေါ်တယ်
- [x] Permission save လုပ်လို့ရတယ်
- [x] Permission update ချက်ချင်း apply ဖြစ်တယ်

---

## 🔒 Security Considerations

### 1. **Double Permission Check**
```typescript
// Always check permission in both UI and handler
{perms.bulk.canExport && <Button />}  // UI check

const handleExport = () => {
  if (!perms.bulk.canExport) return;  // Handler check
  // ... proceed
};
```

### 2. **API-Level Validation**
```typescript
// TODO: Add permission check in API routes
// File: src/app/api/employees/export/route.ts

export async function GET(request: Request) {
  const user = await getCurrentUser();
  
  if (!user.permissions.employeeManagement.bulk.export) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Proceed with export
}
```

### 3. **Audit Logging**
```typescript
// TODO: Log bulk operations
await logAuditEvent({
  userId: user.id,
  action: 'BULK_EXPORT',
  resource: 'employees',
  count: employees.length,
  timestamp: new Date(),
});
```

---

## 📚 Related Files

### Core Files:
- `src/app/dashboard/employee-management/lists/page.tsx` - Main page with export buttons
- `src/app/dashboard/employee-management/lists/hooks/useEmployeePermissions.tsx` - Permission hook
- `src/app/dashboard/user-management/roles/types/permissions.ts` - Type definitions
- `src/app/dashboard/user-management/roles/lib/permissionConfig.ts` - UI metadata
- `prisma/seed.ts` - Default Administrator permissions

### Utility Files:
- `src/app/dashboard/employee-management/lists/utils/exportHelpers.ts` - Export functions

---

**Date:** 2025-10-14  
**Version:** 1.0  
**Status:** ✅ Export Implemented

