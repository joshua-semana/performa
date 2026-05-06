type Props = {
  params: {
    id: string;
  };
};

export default function UserPage({ params }: Props) {
  const id = params.id;

  return <p>This is the user page</p>;
}
