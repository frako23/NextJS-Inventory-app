interface ChartData {
  week: string;
  products: number;
}

export default function ProductsChart({ data }: { data: ChartData[] }) {
  return <div>Products Chart Component</div>;
}
