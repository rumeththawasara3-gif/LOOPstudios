# Firestore Security Specification: Loop Studios Client Portal

## 1. Data Invariants
1. A project cannot be read by an unauthenticated user or an unauthorized client (`resource.data.clientId == request.auth.uid` or `resource.data.clientEmail == request.auth.token.email`).
2. A revision note cannot exist without a valid parent project (`/projects/{projectId}`).
3. A revision note must have `authorId == request.auth.uid`.
4. The client cannot update immutable fields (`clientId`, `createdAt`, `projectId`).
5. Revision notes must enforce text length limits (`note.size() <= 1000` and `note.size() >= 2`).
6. Timestamp format must be strictly checked (`MM:SS`).

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Project Read**: Anonymous request to read `/projects/proj-123`.
2. **Cross-Tenant Project Read**: User A (`auth.uid: user-a`) attempting to read a project owned by User B (`clientId: user-b`).
3. **Ghost Field Injection**: Adding an unauthorized field `isAdmin: true` during revision note creation.
4. **Author Spoofing**: User A attempting to create a revision note with `authorId: user-b`.
5. **Overlong Note Injection**: Submitting a note containing a 50KB payload.
6. **Negative Timestamp**: Submitting a revision note with `timestampSeconds: -15`.
7. **Malformed Timecode Format**: Submitting `timestampFormatted: "invalid_time"`.
8. **Immutability Breach**: Updating `projectId` or `clientId` on an existing document.
9. **Status Enumeration Attack**: Updating note status to `"unauthorized_status"`.
10. **Orphaned Sub-Resource Creation**: Creating a revision note under a non-existent project.
11. **Client Milestone Override**: Client trying to mark Stage 4 as complete when not authorized as studio admin.
12. **Blanket Query Scraping**: Attempting a query on `/projects` without `clientId` filtering matching authenticated UID.

## 3. Test Runner
Verified via rule structure and ABAC invariants.
