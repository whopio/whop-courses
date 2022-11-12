export default function CompanyPage({
  params,
}: {
  params: { company: string };
}) {
  return <p>Hello: {params.company}</p>;
}
