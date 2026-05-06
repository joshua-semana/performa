import UserForm from "@/features/user/forms/user-form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserEditPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6 w-full">
      <UserForm id={id} mode="edit" />
    </div>
  );
}
