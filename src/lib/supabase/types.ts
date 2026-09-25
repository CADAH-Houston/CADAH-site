// Hand-written types mirroring supabase/migrations/0001_init.sql.
// If the schema changes, update this file to match.
//
// NOTE: these are declared with `type`, not `interface`, on purpose —
// TypeScript's structural checks that supabase-js relies on internally
// (matching each table's Row/Insert/Update against `Record<string, unknown>`)
// don't recognize plain `interface` declarations as satisfying that shape,
// which silently collapses every query's inferred type to `never`.

export type MembershipType = "annual" | "lifetime";
export type MembershipTierId = "lifetime" | "regular" | "resident" | "student" | "associate";
export type MemberStatus = "active" | "retired" | "moved" | "inactive";
export type PaymentMethod = "stripe" | "zelle" | "cash" | "check";
export type UserRole = "admin" | "member";
export type EventVisibility = "public" | "members_only";
export type ApplicationStatus = "pending" | "approved" | "rejected";

export type Member = {
  id: string;
  name: string;
  specialty: string | null;
  practice_location: string | null;
  phone: string | null;
  phone_visible: boolean;
  email: string | null;
  email_visible: boolean;
  home_address: string | null;
  home_address_visible: boolean;
  practice_address: string | null;
  practice_address_visible: boolean;
  membership_type: MembershipType;
  // Added by migration 0002; may be missing until that has been run.
  membership_tier?: MembershipTierId;
  status: MemberStatus;
  extra_info: Record<string, unknown>;
  created_at: string;
};

export type Payment = {
  id: string;
  member_id: string;
  amount: number;
  paid_on: string;
  method: PaymentMethod;
  covers_year: number | null;
  is_lifetime: boolean;
  created_at: string;
};

export type AppUser = {
  id: string;
  role: UserRole;
  member_id: string | null;
  created_at: string;
};

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_at: string;
  end_at: string | null;
  visibility: EventVisibility;
  created_at: string;
};

export type EventPhoto = {
  id: string;
  event_id: string | null;
  storage_path: string;
  caption: string | null;
  uploaded_at: string;
};

export type MembershipApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  specialty: string | null;
  practice_location: string | null;
  membership_type_interest: MembershipType | null;
  message: string | null;
  status: ApplicationStatus;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      members: {
        Row: Member;
        Insert: Partial<Member>;
        Update: Partial<Member>;
        Relationships: [];
      };
      payments: {
        Row: Payment;
        Insert: Partial<Payment>;
        Update: Partial<Payment>;
        Relationships: [];
      };
      users: {
        Row: AppUser;
        Insert: Partial<AppUser>;
        Update: Partial<AppUser>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: Partial<EventRow>;
        Update: Partial<EventRow>;
        Relationships: [];
      };
      event_photos: {
        Row: EventPhoto;
        Insert: Partial<EventPhoto>;
        Update: Partial<EventPhoto>;
        Relationships: [];
      };
      membership_applications: {
        Row: MembershipApplication;
        Insert: Partial<MembershipApplication>;
        Update: Partial<MembershipApplication>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
  };
};
