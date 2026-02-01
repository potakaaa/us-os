# Couple Tenancy Model

A **couple** represents a private shared space ("Us").

## Tables

### couples
- One row per shared space
- Created by first user

### couple_members
- Join table between users and couples
- Supports roles (owner/member)

## Helper Function

```sql
is_couple_member(couple_id uuid) → boolean
