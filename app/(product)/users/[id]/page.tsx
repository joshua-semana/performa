type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserPage({ params }: Props) {
  const { id } = await params;

  return <p>This is the user page</p>;
}
