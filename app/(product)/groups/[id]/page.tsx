import GroupPreview from "@/features/group/components/group-preview";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GroupPage({ params }: Props) {
  const { id } = await params;

  return <GroupPreview id={id} />;
}
