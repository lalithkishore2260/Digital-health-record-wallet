import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LogOut,
  Eye,
  UserCheck,
  UserX,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useReports } from '@/hooks/useReports';
import type { Doctor } from '@/types';

interface DoctorDashboardProps {
  onNavigateToReports: () => void;
}

export const DoctorDashboard = ({ onNavigateToReports }: DoctorDashboardProps) => {
  const { currentUser, logout, patients, pending, approvePatient, rejectPatient } = useAuth();
  const { getPendingReports, confirmReport, rejectReport } = useReports();
  
  const doctor = currentUser as Doctor;
  const pendingReports = getPendingReports();
  
  const [selectedTab, setSelectedTab] = useState<'patients' | 'reports'>('patients');

  const handleApprovePatient = (patientId: string) => {
    approvePatient(patientId);
  };

  const handleRejectPatient = (patientId: string) => {
    rejectPatient(patientId);
  };

  const handleConfirmReport = (reportId: string) => {
    confirmReport(reportId, doctor.id);
  };

  const handleRejectReport = (reportId: string) => {
    rejectReport(reportId, doctor.id, "Report needs additional information");
  };

  return (
    <div className="min-h-screen bg-gradient-health">
      {/* Header */}
      <div className="bg-white shadow-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">
                Doctor Dashboard
              </h1>
              <p className="text-muted-foreground">Welcome, {doctor.name} - {doctor.specialization}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-medical text-white">
                {doctor.license}
              </Badge>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-card-hover transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Patients</p>
                  <p className="text-3xl font-bold text-medical-warning">
                    {pending.filter(p => p.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-medical-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved Patients</p>
                  <p className="text-3xl font-bold text-health-excellent">
                    {patients.length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-health-excellent" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Reports</p>
                  <p className="text-3xl font-bold text-medical-primary">
                    {pendingReports.length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-medical-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                  <p className="text-3xl font-bold text-medical-secondary">
                    {patients.length + pending.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-medical-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <Button
            variant={selectedTab === 'patients' ? 'default' : 'ghost'}
            onClick={() => setSelectedTab('patients')}
            className={selectedTab === 'patients' ? 'bg-gradient-medical' : ''}
          >
            <Users className="w-4 h-4 mr-2" />
            Patient Approvals
          </Button>
          <Button
            variant={selectedTab === 'reports' ? 'default' : 'ghost'}
            onClick={() => setSelectedTab('reports')}
            className={selectedTab === 'reports' ? 'bg-gradient-medical' : ''}
          >
            <FileText className="w-4 h-4 mr-2" />
            Report Reviews
          </Button>
        </div>

        {/* Patient Approvals */}
        {selectedTab === 'patients' && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-medical-primary" />
                Patient Application Reviews
              </CardTitle>
              <CardDescription>
                Review and approve patient applications for medical monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pending.filter(p => p.status === 'pending').length > 0 ? (
                <div className="space-y-4">
                  {pending.filter(p => p.status === 'pending').map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-start justify-between p-6 border border-l-4 border-l-medical-warning rounded-lg bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold">{patient.name}</h3>
                          <Badge variant="secondary" className="bg-medical-warning text-white">
                            Pending Review
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground font-medium">Personal Info</p>
                            <p>Age: {patient.age}</p>
                            <p>Gender: {patient.gender}</p>
                            <p>DOB: {new Date(patient.dob).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground font-medium">Contact</p>
                            <p>Phone: {patient.phone}</p>
                            <p>ID: {patient.id}</p>
                            {patient.submissionDate && (
                              <p>Applied: {new Date(patient.submissionDate).toLocaleDateString()}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-muted-foreground font-medium">Medical History</p>
                            <p className="text-xs">{patient.medicalConditions}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-6">
                        <Button
                          size="sm"
                          onClick={() => handleApprovePatient(patient.id)}
                          className="bg-health-excellent hover:bg-health-excellent/80 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectPatient(patient.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Pending Applications</h3>
                  <p className="text-muted-foreground">All patient applications have been reviewed.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Report Reviews */}
        {selectedTab === 'reports' && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-medical-primary" />
                Medical Report Reviews
              </CardTitle>
              <CardDescription>
                Review and confirm patient medical reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingReports.length > 0 ? (
                <div className="space-y-4">
                  {pendingReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-start justify-between p-6 border border-l-4 border-l-medical-primary rounded-lg bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold">{report.patientName}</h3>
                            <p className="text-sm text-muted-foreground">Report ID: {report.id}</p>
                          </div>
                          <Badge variant="secondary" className="bg-medical-primary text-white">
                            Awaiting Review
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground font-medium">Report Date</p>
                            <p>{new Date(report.date).toLocaleDateString()}</p>
                            <p className="text-muted-foreground font-medium mt-2">Symptoms Count</p>
                            <p>{report.symptoms.length} symptoms reported</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground font-medium">Diagnosis Count</p>
                            <p>{report.diagnosis.length} diagnoses</p>
                            <p className="text-muted-foreground font-medium mt-2">Tests Count</p>
                            <p>{report.testsconducted.length} tests conducted</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-muted-foreground font-medium text-xs">Latest Symptoms:</p>
                          <p className="text-xs">{report.symptoms.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-6">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={onNavigateToReports}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleConfirmReport(report.id)}
                          className="bg-health-excellent hover:bg-health-excellent/80 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectReport(report.id)}
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Reports to Review</h3>
                  <p className="text-muted-foreground">All medical reports have been reviewed.</p>
                  <Button
                    className="mt-4 bg-gradient-medical"
                    onClick={onNavigateToReports}
                  >
                    View All Reports
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};