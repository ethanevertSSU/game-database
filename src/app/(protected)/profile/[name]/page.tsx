export default async function Page({ params }: { params: { name: string } }) {
  const account = await params;

  return <div>My slug is: {account.name}</div>;
}
