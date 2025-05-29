"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patient: any;
  onClick: () => void;
  onDischarge: (id: string) => void;
}

export default function PatientCard({ patient, onClick, onDischarge }: Props) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer transition-all duration-300 hover:shadow-md bg-[#F5F9FF] text-[#1C1F26] border border-blue-100 rounded-2xl"
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-[#2E86AB]">
            {patient.patientId}
          </h3>
          <p className="text-sm text-muted-foreground">
            {patient.name},{" "}
            {patient.address && `${patient.address}, `} {patient.mobile}
          </p>
          <Badge variant="outline" className="bg-[#76C7C0] text-white">
            Active
          </Badge>
        </div>

        <Button
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDischarge(patient._id);
          }}
          className="hover:scale-105 transition-transform"
        >
          Discharge
        </Button>
      </CardContent>
    </Card>
  );
}