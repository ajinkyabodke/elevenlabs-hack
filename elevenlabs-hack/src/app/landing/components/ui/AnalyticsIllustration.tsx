import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "../Table";

const summary = [
  {
    name: "Morning Reflections",
    value: "15 entries",
    duration: "8.5 mins",
    sentiment: "Positive",
    growth: "+12.3%",
    clarity: "+8.9%",
    insights: "+6.2%",
    bgColor: "bg-amber-500",
    changeType: "positive",
  },
  {
    name: "Evening Journal",
    value: "22 entries",
    duration: "12.3 mins",
    sentiment: "Mixed",
    growth: "+5.7%",
    clarity: "+4.2%",
    insights: "+7.8%",
    bgColor: "bg-emerald-500",
    changeType: "positive",
  },
  {
    name: "Weekly Review",
    value: "4 entries",
    duration: "15.2 mins",
    sentiment: "Neutral",
    growth: "+2.1%",
    clarity: "+3.5%",
    insights: "+4.1%",
    bgColor: "bg-yellow-400",
    changeType: "positive",
  },
];

export default function JournalPerformance() {
  return (
    <div className="h-150 perspective-[4000px] perspective-origin-center shrink-0 overflow-hidden [mask-image:radial-gradient(white_30%,transparent_90%)]">
      <div className="-translate-z-10 rotate-x-10 rotate-y-20 -rotate-z-10 transform-3d -translate-y-10">
        {/* <h3 className="text-sm text-gray-500">Journal Activity Overview</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900">
          41 Total Entries
        </p>
        <p className="mt-1 text-sm font-medium">
          <span className="text-emerald-700">+12 entries (41.3%)</span>{" "}
          <span className="font-normal text-gray-500">vs. last month</span>
        </p> */}
        {/* <LineChartIllustration className="min-w-200 mt-8 w-full shrink-0" /> */}

        <TableRoot className="min-w-200 mt-20">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Journal Type</TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Entries
                </TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Avg Duration
                </TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Sentiment
                </TableHeaderCell>
                <TableHeaderCell className="text-right">Growth</TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Clarity
                </TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Insights
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex space-x-3">
                      <span
                        className={item.bgColor + " w-1 shrink-0 rounded"}
                        aria-hidden="true"
                      />
                      <span>{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.value}</TableCell>
                  <TableCell className="text-right">{item.duration}</TableCell>
                  <TableCell className="text-right">{item.sentiment}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-emerald-700">{item.growth}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-emerald-700">{item.clarity}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-emerald-700">{item.insights}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      </div>
    </div>
  );
}
