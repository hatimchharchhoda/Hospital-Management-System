import React, { Suspense } from "react";
import PatientAdmissionForm from "@/components/PatientAdmissionForm";

export default function AdmissionPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <PatientAdmissionForm />
    </Suspense>
  );
}