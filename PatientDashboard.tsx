import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Droplets,
  FileText,
  Calendar,
  Pill,
  Clock,
  Edit,
  Eye,
  LogOut,
  MessageCircle,
  Download
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useReports } from '@/hooks/useReports';
import { PatientChatbotHTML } from './PatientChatbot';
import { downloadReport } from '@/utils/pdfGenerator';
import type { Patient, HealthMetrics } from '@/types';

interface PatientDashboardProps {
  onNavigateToReports: () => void;
}

export const PatientDashboard = ({ onNavigateToReports }: PatientDashboardProps) => {
  const { currentUser, logout } = useAuth();
  const { getPatientReports } = useReports();
  
  const patient = currentUser as Patient;
  const reports = getPatientReports(patient.id);
  
  // Chatbot state
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotMinimized, setChatbotMinimized] = useState(false);
  
  // Mock health metrics - in real app, this would come from IoT devices
  const [healthMetrics] = useState<HealthMetrics>({
    heartRate: 72,
    temperature: 98.6,
    bloodPressure: '120/80',
    oxygenLevel: 98
  });

  const getHealthStatus = (metric: keyof HealthMetrics, value: number | string) => {
    switch (metric) {
      case 'heartRate':
        if (typeof value === 'number') {
          if (value >= 60 && value <= 100) return { status: 'excellent', color: 'health-excellent' };
          if (value >= 50 && value <= 110) return { status: 'good', color: 'health-good' };
          return { status: 'fair', color: 'health-fair' };
        }
        break;
      case 'temperature':
        if (typeof value === 'number') {
          if (value >= 97.0 && value <= 99.0) return { status: 'excellent', color: 'health-excellent' };
          if (value >= 96.0 && value <= 100.4) return { status: 'good', color: 'health-good' };
          return { status: 'fair', color: 'health-fair' };
        }
        break;
      case 'oxygenLevel':
        if (typeof value === 'number') {
          if (value >= 95) return { status: 'excellent', color: 'health-excellent' };
          if (value >= 90) return { status: 'good', color: 'health-good' };
          return { status: 'poor', color: 'health-poor' };
        }
        break;
    }
    return { status: 'good', color: 'health-good' };
  };

  if (patient.status !== 'approved') {
    return (
      <div className="min-h-screen bg-gradient-health flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-medical">
          <CardHeader className="text-center">
            <Clock className="w-12 h-12 text-medical-warning mx-auto mb-4" />
            <CardTitle className="text-2xl text-medical-warning">Account Pending</CardTitle>
            <CardDescription>
              Your registration is being reviewed by our medical team
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Once approved, you'll have access to all health monitoring features.
            </p>
            <Button onClick={logout} variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-health">
      {/* Header */}
      <div className="bg-white shadow-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">
                Health Dashboard
              </h1>
              <p className="text-muted-foreground">Welcome back, {patient.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                variant="secondary" 
                className="bg-health-excellent text-white"
              >
                {patient.status}
              </Badge>
              <Button 
                onClick={() => setShowChatbot(true)} 
                variant="outline" 
                size="sm"
                className="bg-medical-primary text-white hover:bg-medical-primary/90"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Health Assistant
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-card-hover transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                  <p className="text-3xl font-bold text-medical-primary">
                    {healthMetrics.heartRate} 
                    <span className="text-sm text-muted-foreground ml-1">bpm</span>
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${getHealthStatus('heartRate', healthMetrics.heartRate).color}/10`}>
                  <Heart className={`w-6 h-6 text-${getHealthStatus('heartRate', healthMetrics.heartRate).color}`} />
                </div>
              </div>
              <Progress 
                value={75} 
                className="mt-3"
              />
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Temperature</p>
                  <p className="text-3xl font-bold text-medical-primary">
                    {healthMetrics.temperature}
                    <span className="text-sm text-muted-foreground ml-1">°F</span>
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${getHealthStatus('temperature', healthMetrics.temperature).color}/10`}>
                  <Thermometer className={`w-6 h-6 text-${getHealthStatus('temperature', healthMetrics.temperature).color}`} />
                </div>
              </div>
              <Progress 
                value={85} 
                className="mt-3"
              />
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Pressure</p>
                  <p className="text-3xl font-bold text-medical-primary">
                    {healthMetrics.bloodPressure}
                    <span className="text-sm text-muted-foreground ml-1">mmHg</span>
                  </p>
                </div>
                <div className="p-3 rounded-full bg-health-excellent/10">
                  <Activity className="w-6 h-6 text-health-excellent" />
                </div>
              </div>
              <Progress 
                value={90} 
                className="mt-3"
              />
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Oxygen Level</p>
                  <p className="text-3xl font-bold text-medical-primary">
                    {healthMetrics.oxygenLevel}
                    <span className="text-sm text-muted-foreground ml-1">%</span>
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${getHealthStatus('oxygenLevel', healthMetrics.oxygenLevel).color}/10`}>
                  <Droplets className={`w-6 h-6 text-${getHealthStatus('oxygenLevel', healthMetrics.oxygenLevel).color}`} />
                </div>
              </div>
              <Progress 
                value={95} 
                className="mt-3"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-medical-primary" />
                Medical Reports
              </CardTitle>
              <CardDescription>
                Your recent medical reports and their status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reports.length > 0 ? (
                <>
                  {reports.slice(0, 3).map((report) => (
                    <div 
                      key={report.id} 
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{report.date}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.doctorName || 'No doctor assigned'}
                        </p>
                        <Badge 
                          variant={
                            report.status === 'confirmed' ? 'default' :
                            report.status === 'submitted' ? 'secondary' :
                            report.status === 'rejected' ? 'destructive' : 'outline'
                          }
                          className="mt-1"
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => downloadReport(report)}
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {report.isEditable && (
                          <Button size="sm" variant="outline" onClick={onNavigateToReports}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={onNavigateToReports}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={onNavigateToReports}
                  >
                    View All Reports
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No medical reports yet</p>
                  <Button 
                    className="mt-4 bg-gradient-medical"
                    onClick={onNavigateToReports}
                  >
                    Create New Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-medical-primary" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Your latest health monitoring activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-health-excellent mr-3" />
                    <div>
                      <p className="text-sm font-medium">Last Checkup</p>
                      <p className="text-xs text-muted-foreground">Regular health monitoring</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">2 days ago</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center">
                    <Pill className="w-4 h-4 text-medical-warning mr-3" />
                    <div>
                      <p className="text-sm font-medium">Medication Reminder</p>
                      <p className="text-xs text-muted-foreground">Daily prescription</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Today</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 text-health-good mr-3" />
                    <div>
                      <p className="text-sm font-medium">Lab Results</p>
                      <p className="text-xs text-muted-foreground">Blood work completed</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">1 week ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
 {/* Chatbot */}
      {showChatbot && (
        <PatientChatbotHTML
          isMinimized={chatbotMinimized}
          onToggleMinimize={() => setChatbotMinimized(!chatbotMinimized)}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  );
};
    