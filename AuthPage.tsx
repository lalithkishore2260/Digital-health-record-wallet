import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Stethoscope, Users, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const AuthPage = () => {
  const { login, registerDoctor, registerPatient } = useAuth();
  const [activeTab, setActiveTab] = useState('doctor-login');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>, userType: 'doctor' | 'patient') => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const credentials = {
      id: formData.get('id') as string,
      password: formData.get('password') as string
    };
    
    const success = login(userType, credentials);
    if (success) {
      // Redirect will be handled by the main app based on auth state
    }
  };

  const handleDoctorRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const doctorData = {
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      dob: formData.get('dob') as string,
      gender: formData.get('gender') as 'Male' | 'Female' | 'Other',
      license: formData.get('license') as string,
      specialization: formData.get('specialization') as string,
      phone: formData.get('phone') as string || 'Not provided',
      password: 'password123'
    };
    
    registerDoctor(doctorData);
  };

  const handlePatientRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const patientData = {
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      dob: formData.get('dob') as string,
      gender: formData.get('gender') as 'Male' | 'Female' | 'Other',
      phone: formData.get('phone') as string,
      medicalConditions: formData.get('medicalConditions') as string || 'None reported',
      password: 'patient123'
    };
    
    registerPatient(patientData);
  };

  return (
    <div className="min-h-screen bg-gradient-medical flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Smart Health Monitoring</h1>
            <p className="text-white/80">Healing Hands, Helping Hearts</p>
          </div>

          <Card className="shadow-medical backdrop-blur-sm bg-white/95">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl bg-gradient-medical bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Access your medical dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="doctor-login" className="text-sm">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Doctor Login
                  </TabsTrigger>
                  <TabsTrigger value="patient-login" className="text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    Patient Login
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="doctor-login" className="mt-6">
                  <form onSubmit={(e) => handleLogin(e, 'doctor')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-id">License Number</Label>
                      <Input
                        id="doctor-id"
                        name="id"
                        placeholder="Try: DOC001 or DOC002"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-password">Password</Label>
                      <Input
                        id="doctor-password"
                        name="password"
                        type="password"
                        placeholder="Try: password123"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-medical hover:shadow-card-hover transition-all">
                      Login as Doctor
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Demo: DOC001/password123 or DOC002/password123
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="patient-login" className="mt-6">
                  <form onSubmit={(e) => handleLogin(e, 'patient')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-id">Medical ID</Label>
                      <Input
                        id="patient-id"
                        name="id"
                        placeholder="Try: PAT001 or PAT002"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-password">Password</Label>
                      <Input
                        id="patient-password"
                        name="password"
                        type="password"
                        placeholder="Try: patient123"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-medical hover:shadow-card-hover transition-all">
                      Login as Patient
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Demo: PAT001/patient123 or PAT002/patient123
                    </p>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('doctor-register')}
                    className="text-xs"
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    Doctor Signup
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('patient-register')}
                    className="text-xs"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    Patient Signup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Forms */}
          {activeTab === 'doctor-register' && (
            <Card className="mt-4 shadow-medical backdrop-blur-sm bg-white/95">
              <CardHeader>
                <CardTitle className="text-xl">Doctor Registration</CardTitle>
                <CardDescription>Join our healthcare network</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDoctorRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doc-name">Name</Label>
                      <Input id="doc-name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doc-age">Age</Label>
                      <Input id="doc-age" name="age" type="number" min="25" max="80" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc-dob">Date of Birth</Label>
                    <Input id="doc-dob" name="dob" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc-gender">Gender</Label>
                    <Select name="gender" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc-license">License Number</Label>
                    <Input id="doc-license" name="license" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc-specialization">Specialization</Label>
                    <Input id="doc-specialization" name="specialization" required />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-medical">
                    Register Doctor
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setActiveTab('doctor-login')}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'patient-register' && (
            <Card className="mt-4 shadow-medical backdrop-blur-sm bg-white/95">
              <CardHeader>
                <CardTitle className="text-xl">Patient Registration</CardTitle>
                <CardDescription>Apply for medical monitoring access</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePatientRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pat-name">Name</Label>
                      <Input id="pat-name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pat-age">Age</Label>
                      <Input id="pat-age" name="age" type="number" min="1" max="120" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pat-dob">Date of Birth</Label>
                    <Input id="pat-dob" name="dob" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pat-gender">Gender</Label>
                    <Select name="gender" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pat-phone">Phone Number</Label>
                    <Input id="pat-phone" name="phone" type="tel" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pat-conditions">Medical Conditions</Label>
                    <Textarea 
                      id="pat-conditions" 
                      name="medicalConditions" 
                      placeholder="List any existing medical conditions or medications"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-medical">
                    Submit Application
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setActiveTab('patient-login')}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side - Branding */}
        <div className="hidden lg:block text-center text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 rounded-3xl mb-6 backdrop-blur-sm">
              <Stethoscope className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Healthcare Excellence</h2>
            <p className="text-xl text-white/90 mb-6">Care. Cure. Connect.</p>
            <p className="text-white/80 max-w-md mx-auto leading-relaxed">
              Advanced health monitoring system connecting patients and healthcare providers 
              for better medical outcomes and streamlined care management.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-white/80">Monitoring</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-white/80">Secure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};