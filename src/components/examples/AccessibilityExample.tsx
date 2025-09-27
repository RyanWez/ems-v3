'use client';

import { useState } from 'react';
import { AccessibleModal, ScreenReaderAnnouncements } from '@/components/AccessibleModal';
import { MobileOptimizedButton, FloatingActionButton, MobileButtonGroup } from '@/components/MobileOptimizedButton';
import { useAccessibility, useReducedMotion, useHighContrast } from '@/hooks/useAccessibility';
import { aria, focus, screenReader, color, mobile } from '@/lib/accessibility';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';

export function AccessibilityExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  const { announce, announcements, createSkipLink } = useAccessibility();
  const prefersReducedMotion = useReducedMotion();
  const prefersHighContrast = useHighContrast();

  // Generate unique IDs for ARIA relationships
  const mainContentId = aria.generateId('main-content');
  const skipLinkProps = createSkipLink(mainContentId, 'Skip to main content');

  // Handle item selection with announcement
  const handleItemSelect = (item: string) => {
    setSelectedItem(item);
    announce(`Selected ${item}`, 'polite');
  };

  // Check color contrast (example)
  const buttonColors = {
    primary: '#3B82F6',
    background: '#FFFFFF'
  };
  
  const hasGoodContrast = color.meetsContrastStandard(
    buttonColors.primary, 
    buttonColors.background, 
    'AA'
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Skip Link */}
      <a {...skipLinkProps}>
        Skip to main content
      </a>

      {/* Screen Reader Announcements */}
      <ScreenReaderAnnouncements announcements={announcements} />

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Accessibility & Mobile Optimization Example
        </h1>
        
        {/* Accessibility Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Accessibility Status
          </h2>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>✓ Screen reader support enabled</li>
            <li>✓ Keyboard navigation available</li>
            <li>✓ Focus management implemented</li>
            <li>✓ ARIA labels and roles configured</li>
            <li>{hasGoodContrast ? '✓' : '⚠'} Color contrast: {hasGoodContrast ? 'WCAG AA compliant' : 'Needs improvement'}</li>
            <li>{mobile.isMobile() ? '✓' : 'ℹ'} Mobile optimizations: {mobile.isMobile() ? 'Active' : 'Desktop mode'}</li>
            <li>{prefersReducedMotion ? '✓' : 'ℹ'} Reduced motion: {prefersReducedMotion ? 'Enabled' : 'Standard animations'}</li>
            <li>{prefersHighContrast ? '✓' : 'ℹ'} High contrast: {prefersHighContrast ? 'Enabled' : 'Standard contrast'}</li>
          </ul>
        </div>
      </header>

      {/* Main Content */}
      <main id={mainContentId}>
        {/* Button Examples */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Mobile-Optimized Buttons
          </h2>
          
          <div className="space-y-4">
            {/* Single Buttons */}
            <div className="flex flex-wrap gap-4">
              <MobileOptimizedButton
                variant="primary"
                size="touch"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => announce('Add button clicked')}
              >
                Add Item
              </MobileOptimizedButton>

              <MobileOptimizedButton
                variant="secondary"
                size="lg"
                loading={false}
                loadingText="Saving..."
                icon={<Edit className="w-4 h-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Edit
              </MobileOptimizedButton>

              <MobileOptimizedButton
                variant="danger"
                size="md"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => announce('Delete action initiated', 'assertive')}
              >
                Delete
              </MobileOptimizedButton>
            </div>

            {/* Button Group */}
            <MobileButtonGroup orientation="horizontal" spacing="normal">
              <MobileOptimizedButton variant="outline" size="md">
                Cancel
              </MobileOptimizedButton>
              <MobileOptimizedButton variant="primary" size="md">
                Confirm
              </MobileOptimizedButton>
            </MobileButtonGroup>

            {/* Full Width Button */}
            <MobileOptimizedButton
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => announce('Full width action executed')}
            >
              Full Width Action
            </MobileOptimizedButton>
          </div>
        </section>

        {/* Interactive List Example */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Accessible Interactive List
          </h2>
          
          <div 
            role="listbox"
            aria-label="Employee list"
            className="border border-gray-200 rounded-lg divide-y divide-gray-200"
          >
            {['John Doe', 'Jane Smith', 'Mike Johnson'].map((name, index) => (
              <div
                key={name}
                role="option"
                aria-selected={selectedItem === name}
                tabIndex={0}
                className={`
                  p-4 cursor-pointer transition-colors
                  hover:bg-gray-50 focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${selectedItem === name ? 'bg-blue-100' : ''}
                `}
                onClick={() => handleItemSelect(name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemSelect(name);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{name}</span>
                  {selectedItem === name && (
                    <span className="text-blue-600 text-sm" aria-hidden="true">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {selectedItem && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {selectedItem}
            </p>
          )}
        </section>

        {/* Form Example */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Accessible Form
          </h2>
          
          <form className="space-y-4 max-w-md">
            <div>
              <label 
                htmlFor="employee-name" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Employee Name *
              </label>
              <input
                {...aria.createFormControlProps(
                  'employee-name',
                  'Employee Name',
                  'Enter the full name of the employee',
                  undefined,
                  true
                )}
                type="text"
                className="
                  w-full px-3 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  min-h-[44px]
                "
                placeholder="Enter employee name"
              />
              <p id="employee-name-description" className="mt-1 text-sm text-gray-500">
                Enter the full name of the employee
              </p>
            </div>

            <div>
              <label 
                htmlFor="employee-email" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                {...aria.createFormControlProps('employee-email', 'Email Address')}
                type="email"
                className="
                  w-full px-3 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  min-h-[44px]
                "
                placeholder="Enter email address"
              />
            </div>

            <MobileOptimizedButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
            >
              Submit Form
            </MobileOptimizedButton>
          </form>
        </section>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton
        position="bottom-right"
        onClick={() => setIsModalOpen(true)}
        aria-label="Open settings"
      >
        <Settings className="w-6 h-6" />
      </FloatingActionButton>

      {/* Accessible Modal */}
      <AccessibleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Settings"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is an accessible modal dialog with proper focus management,
            keyboard navigation, and screen reader support.
          </p>
          
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Accessibility Features:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Focus trap within modal</li>
              <li>Escape key to close</li>
              <li>Click outside to close</li>
              <li>Proper ARIA attributes</li>
              <li>Screen reader announcements</li>
              <li>Focus restoration on close</li>
            </ul>
          </div>

          <MobileButtonGroup orientation="horizontal" spacing="normal">
            <MobileOptimizedButton
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </MobileOptimizedButton>
            <MobileOptimizedButton
              variant="primary"
              onClick={() => {
                announce('Settings saved successfully');
                setIsModalOpen(false);
              }}
            >
              Save Settings
            </MobileOptimizedButton>
          </MobileButtonGroup>
        </div>
      </AccessibleModal>
    </div>
  );
}