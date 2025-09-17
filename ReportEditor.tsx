import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Plus, 
  X,
  Stethoscope,
  Activity,
  FileCheck,
  SendHorizontal
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useReports } from '@/hooks/useReports';
import type { MedicalReport, Patient, Doctor } from '@/types';
import { toast } from 'sonner';

interface ReportEditorProps {
  onBack: () => void;
  reportId?: string;
}

export const ReportEditor = ({ onBack, reportId }: ReportEditorProps) => {
  const { currentUser } = useAuth();
  const { reports, updateReport, createReport } = useReports();
  
  const [report, setReport] = useState<Partial<MedicalReport>>({
    patientId: currentUser?.id || '',
    patientName: currentUser?.name || '',
    date: new Date().toISOString().split('T')[0],
    symptoms: [''],
    diagnosis: [''],
    testsconducted: [''],
    treatmentPlan: [''],
    additionalNotes: '',
    status: 'draft',
    isEditable: true
  });

  const [newSymptom, setNewSymptom] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newTest, setNewTest] = useState('');
  const [newTreatment, setNewTreatment] = useState('');

  const isPatient = currentUser?.type === 'patient';
  const isDoctor = currentUser?.type === 'doctor';

  useEffect(() => {
    if (reportId) {
      const existingReport = reports.find(r => r.id === reportId);
      if (existingReport) {
        setReport(existingReport);
      }
    }
  }, [reportId, reports]);

  const addItem = (field: keyof Pick<MedicalReport, 'symptoms' | 'diagnosis' | 'testsconducted' | 'treatmentPlan'>, value: string) => {
    if (!value.trim()) return;
    
    setReport(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), value.trim()]
    }));
    
    // Clear the input based on field
    switch (field) {
      case 'symptoms':
        setNewSymptom('');
        break;
      case 'diagnosis':
        setNewDiagnosis('');
        break;
      case 'testsconducted':
        setNewTest('');
        break;
      case 'treatmentPlan':
        setNewTreatment('');
        break;
    }
  };

  const removeItem = (field: keyof Pick<MedicalReport, 'symptoms' | 'diagnosis' | 'testsconducted' | 'treatmentPlan'>, index: number) => {
    setReport(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (reportId) {
      updateReport(reportId, report);
    } else {
      createReport(report as Omit<MedicalReport, 'id'>);
    }
    onBack();
  };

  const handleSubmit = () => {
    if (reportId) {
      updateReport(reportId, { ...report, status: 'submitted' });
      toast.success('Report submitted for doctor review!');
    } else {
      createReport({ ...report, status: 'submitted' } as Omit<MedicalReport, 'id'>);
      toast.success('Report created and submitted!');
    }
    onBack();
  };

  const canEdit = report.isEditable && (
    (isPatient && report.patientId === currentUser?.id) ||
    (isDoctor)
  );

  return (
    <div className="min-h-screen bg-gradient-health">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">
                {reportId ? 'Edit Medical Report' : 'New Medical Report'}
              </h1>
              <p className="text-muted-foreground">
                {isPatient ? 'Document your health information' : 'Review patient report'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={report.status === 'confirmed' ? 'default' : 'secondary'}
              className={
                report.status === 'confirmed' ? 'bg-health-excellent text-white' :
                report.status === 'submitted' ? 'bg-medical-primary text-white' :
                'bg-muted'
              }
            >
              {report.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-8">
          {/* Basic Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-medical-primary" />
                Report Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">Patient Name</Label>
                  <Input
                    id="patient-name"
                    value={report.patientName || ''}
                    onChange={(e) => setReport(prev => ({ ...prev, patientName: e.target.value }))}
                    disabled={!canEdit || isPatient}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-date">Report Date</Label>
                  <Input
                    id="report-date"
                    type="date"
                    value={report.date || ''}
                    onChange={(e) => setReport(prev => ({ ...prev, date: e.target.value }))}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-name">Assigned Doctor</Label>
                  <Input
                    id="doctor-name"
                    value={report.doctorName || 'Not assigned'}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptoms */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-medical-warning" />
                Symptoms
              </CardTitle>
              <CardDescription>
                {isPatient ? 'Describe your symptoms' : 'Review reported symptoms'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {canEdit && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new symptom..."
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('symptoms', newSymptom)}
                  />
                  <Button
                    size="sm"
                    onClick={() => addItem('symptoms', newSymptom)}
                    className="bg-gradient-medical"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="space-y-2">
                {report.symptoms?.filter(s => s.trim()).map((symptom, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>{symptom}</span>
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('symptoms', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-medical-secondary" />
                Diagnosis
              </CardTitle>
              <CardDescription>
                Medical diagnosis and findings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {canEdit && isDoctor && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add diagnosis..."
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('diagnosis', newDiagnosis)}
                  />
                  <Button
                    size="sm"
                    onClick={() => addItem('diagnosis', newDiagnosis)}
                    className="bg-gradient-medical"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="space-y-2">
                {report.diagnosis?.filter(d => d.trim()).map((diagnosis, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>{diagnosis}</span>
                    {canEdit && isDoctor && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('diagnosis', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {(!report.diagnosis?.length || report.diagnosis.every(d => !d.trim())) && (
                  <p className="text-muted-foreground italic">No diagnosis recorded yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tests Conducted */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="w-5 h-5 mr-2 text-health-excellent" />
                Tests Conducted
              </CardTitle>
              <CardDescription>
                Medical tests and results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {canEdit && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add test result..."
                    value={newTest}
                    onChange={(e) => setNewTest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('testsconducted', newTest)}
                  />
                  <Button
                    size="sm"
                    onClick={() => addItem('testsconducted', newTest)}
                    className="bg-gradient-medical"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="space-y-2">
                {report.testsconducted?.filter(t => t.trim()).map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>{test}</span>
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('testsconducted', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Treatment Plan */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-medical-accent" />
                Treatment Plan
              </CardTitle>
              <CardDescription>
                Recommended treatment and care plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {canEdit && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add treatment recommendation..."
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('treatmentPlan', newTreatment)}
                  />
                  <Button
                    size="sm"
                    onClick={() => addItem('treatmentPlan', newTreatment)}
                    className="bg-gradient-medical"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="space-y-2">
                {report.treatmentPlan?.filter(t => t.trim()).map((treatment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>{treatment}</span>
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('treatmentPlan', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>
                Any additional observations or recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={report.additionalNotes || ''}
                onChange={(e) => setReport(prev => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder="Enter additional notes..."
                rows={4}
                disabled={!canEdit}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {canEdit && (
            <div className="flex justify-end space-x-4 pb-8">
              <Button
                variant="outline"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              {isPatient && (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-medical"
                >
                  <SendHorizontal className="w-4 h-4 mr-2" />
                  Submit for Review
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};