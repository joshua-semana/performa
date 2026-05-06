import UserForm from "@/features/user/forms/user-form";

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <UserForm mode="create" />
    </div>
  );
}
