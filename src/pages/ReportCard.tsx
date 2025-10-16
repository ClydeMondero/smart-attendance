import { forwardRef } from "react";

const ReportCard = forwardRef<HTMLDivElement, { student: any; grades: any[] }>(
  ({ student, grades }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white text-black p-6 rounded-lg shadow w-full"
      >
        <h2 className="text-xl font-bold text-center mb-2">
          {student.school_class?.grade_level} - Report Card
        </h2>
        <p className="text-center mb-4">{student.full_name}</p>

        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Subject</th>
              <th className="border p-2">Grading Period</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g: any, i: number) => (
              <tr key={i}>
                <td className="border p-2">{g.subject?.name}</td>
                <td className="border p-2">{g.grading_period}</td>
                <td className="border p-2 text-center">{g.score}</td>
                <td className="border p-2">{g.remarks ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

ReportCard.displayName = "ReportCard";
export default ReportCard;
