# Admin Components

This directory contains React components for the job management admin portal.

## Components

### JobForm.tsx

Professional form component for creating and editing job listings.

**Features:**

- Full validation with inline error messages
- Skills management with quick suggestions
- Support for add/remove individual skills
- Responsive design
- Loading states
- Clear error feedback

**Props:**

```typescript
interface JobFormProps {
  job: Job | null; // null for create, Job object for edit
  isLoading: boolean; // Show loading state
  onSubmit: (data: JobFormData) => Promise<ValidationErrors>;
  onCancel: () => void; // Handle back/cancel action
}
```

**Usage:**

```tsx
<JobForm
  job={selectedJob}
  isLoading={isLoading}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

### JobList.tsx

Table component displaying all jobs with management options.

**Features:**

- Sortable job table
- Edit and delete buttons for each job
- Auto-detection of jobs older than 20 days
- Cleanup button for old jobs
- Summary statistics at bottom
- Loading states
- Responsive table with horizontal scroll

**Props:**

```typescript
interface JobListProps {
  jobs: Job[]; // Array of jobs to display
  isLoading: boolean; // Show loading state
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onCleanup: () => void; // Delete jobs > 20 days old
  onFetchJobs: () => void; // Refresh job list
}
```

**Usage:**

```tsx
<JobList
  jobs={jobs}
  isLoading={isLoading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onCleanup={handleCleanup}
  onFetchJobs={fetchJobs}
/>
```

## Styling

Both components use:

- Tailwind CSS for styling
- Dark theme (slate-800/900 backgrounds)
- Blue accent colors
- Responsive grid layouts
- Smooth transitions and hover effects

## Icons Used

Components use icons from `lucide-react`:

- `Edit2` - Edit button
- `Trash2` - Delete button
- `X` - Remove skill
- `RefreshCw` - Refresh icon
- `Zap` - Cleanup icon

## Validation

Validation is performed using `validateJobForm()` from `lib/jobs-utils.ts`:

```typescript
const errors = validateJobForm(formData);
if (Object.keys(errors).length > 0) {
  // Show errors
}
```

## Error Handling

- Form validates before API call
- API errors are caught and displayed
- User-friendly error messages
- Errors are cleared when user modifies field

## Loading States

- Submit button shows "Saving..." during API call
- Form inputs are disabled during submission
- List shows spinner while loading jobs
- Buttons show disabled state during operations

## Accessibility

- Proper label associations
- ARIA roles for alerts
- Semantic HTML
- Keyboard navigation support
- Tab order preserved

## Performance

- No unnecessary re-renders
- Memoized callbacks where appropriate
- Efficient state management
- Minimal dependencies

## Testing Tips

1. Test form validation with various inputs
2. Test skill add/remove functionality
3. Test API error scenarios
4. Test loading states during operations
5. Test responsive behavior on mobile
6. Test keyboard navigation

## Common Customizations

### Change color scheme

Update Tailwind classes in both components:

- `bg-slate-*` → Your preferred background
- `text-blue-*` → Your preferred accent color
- `hover:bg-slate-*` → Your preferred hover color

### Add more fields

1. Add to `JobFormData` type in `jobs-utils.ts`
2. Add input in `JobForm.tsx`
3. Add to validation in `jobs-utils.ts`
4. Add to table column in `JobList.tsx`

### Customize table columns

Edit the `<table>` structure in `JobList.tsx`:

- Add/remove `<th>` headers
- Modify `<td>` content per job
- Update CSS classes for width/alignment

### Change validation rules

Edit `validateJobForm()` in `lib/jobs-utils.ts`:

- Add new validations
- Modify error messages
- Adjust field length limits

## Related Files

- **lib/jobs-utils.ts** - Types, validation, utilities
- **app/admin/jobs/page.tsx** - Main page component
- **app/api/jobs/** - API routes for CRUD operations
- **docs/JOBS_SETUP.md** - Setup instructions
- **docs/QUICK_REFERENCE.md** - Quick reference guide
