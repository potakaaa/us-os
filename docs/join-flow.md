# Join Couple Flow

This document describes how partners join a couple space in UsOS. The flow is **password-based**: the creator shares their couple space name and password with their partner; whoever first logs in with those credentials becomes the couple.

---

## Overview

| Role | Flow |
|------|------|
| **Creator** | Creates couple → Sets password → Shares name + password with partner |
| **Partner** | Signs in/up → Chooses "Join existing couple" → Enters name + password → Joins |

---

## Creator Flow

### 1. Create Couple Space

**Route:** `/create-couple`

- User enters a unique couple space name (e.g. "Our Space")
- Clicks "Create Couple Space"
- Couple names must be unique across the app

### 2. Set Password

**Route:** `/create-couple-password`

- User sets a password (or skips)
- **Important:** Joining only works if a password is set. If the creator skips, the partner cannot join.
- Screen shows: *"Share your couple space name and password with your partner so they can join."*

### 3. Home

- Creator lands on home
- Shares the **couple space name** and **password** with their partner (via message, in person, etc.)

---

## Partner Flow

### 1. Sign In or Sign Up

**Routes:** `/sign-in`, `/sign-up`

- Partner must have an account before joining

### 2. Create or Join

**Route:** `/create-couple`

- When a user has no couple, they are redirected to create-couple
- Partner clicks **"Join existing couple"** at the bottom (instead of creating a new space)

### 3. Join Couple

**Route:** `/join-couple`

- Partner enters:
  - **Couple space name** (exact name the creator chose)
  - **Password** (the password the creator set)
- Clicks "Join Couple Space"

### 4. Home

- On success, partner is added to the couple and redirected to home

---

## Flow Diagram

```
Creator:
  create-couple → create-couple-password → home
                        ↓
              (shares name + password)
                        ↓
Partner:
  sign-in/sign-up → create-couple → "Join existing couple" → join-couple → home
```

---

## Rules and Constraints

| Rule | Description |
|------|-------------|
| **First to join wins** | Only the first person who enters the correct name + password joins. Once a couple has 2 members, no one else can join. |
| **Unique names** | Couple space names must be unique. Creating fails with "This couple space name is already taken" if the name exists. |
| **Password required** | Partner can only join if the creator set a password. If the creator skipped, the partner sees "This couple space has no password set." |
| **Already in a couple** | Users who already belong to a couple are redirected to home and never see the create/join screens. |

---

## Technical Details

### Database

- **Unique index:** `couples.name` has a case-insensitive unique constraint
- **RPC:** `join_couple_by_password(p_couple_name, p_password)` verifies the password via pgcrypto (bcrypt) and adds the user to `couple_members`

### Routes

| Route | File | Purpose |
|-------|------|---------|
| `/create-couple` | `app/(onboarding)/create-couple.tsx` | Create new couple or navigate to join |
| `/create-couple-password` | `app/(onboarding)/create-couple-password.tsx` | Set optional password |
| `/join-couple` | `app/(onboarding)/join-couple.tsx` | Join by name + password |

### Redirects

- Unauthenticated user on `/join-couple` → `/sign-in?redirect=join-couple`
- After sign-in with `redirect=join-couple` → `/join-couple`
