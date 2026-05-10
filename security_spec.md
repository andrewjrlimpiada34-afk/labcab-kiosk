# LabCab Security Specification

## Data Invariants
1. A **User** must have a verified `studentID` and a 6-digit `pin`.
2. An **InventoryItem** can only be modified by an `Admin`.
3. A **Transaction** is "Active" when created and can only be marked as "Returned" once.
4. Users can only access their own profile and transactions using their `studentID` as the link.
5. In the Kiosk environment, "Identity" is established by `studentID`. (Since we don't use Firebase Auth for students, but for Admins, we must secure student data carefully).

## The Dirty Dozen Payloads (Rejection Targets)
1. Someone else's studentID in the payload.
2. Changing `totalQuantity` of an apparatus as a student.
3. Deleting an apparatus from the kiosk.
4. Returning items that are not in the active transaction list.
5. Creating a transaction with a non-existent studentID.
6. Spoofing the `borrowTime` to the past.
7. Modifying a `returned` transaction back to `active`.
8. Massive string injection into PIN field (Must be exactly 6 chars).
9. Updating `availableQuantity` to a negative number.
10. Reading the `admins` collection as a student.
11. Reading all `users` as a student (must only read self).
12. Creating a user with `isAdmin: true` attribute.

## Security Rules Strategy
1. **Validation Helpers**: `isValidId`, `isValidUser`, `isValidInventory`, `isValidTransaction`.
2. **Identity Logic**: Since students aren't "LoggedIn" via Firebase Auth (kiosk mode uses IDs), we verify presence of valid IDs in request data. Admins use standard `request.auth`.
3. **Immutability**: `createdAt`, `studentID` are immutable.

## Test Runner (Reference)
Tests would verify that:
- `get(/users/anotherUser)` returns 403.
- `update(/inventory/item, {totalQuantity: 100})` returns 403 for non-admins.
