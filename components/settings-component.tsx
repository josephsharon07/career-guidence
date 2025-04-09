"use client"
import { Bell, Moon, Sun, Laptop, Shield, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState<'light' | 'dark' | 'system'>('system');
  const [privacy, setPrivacy] = useState(false);

  const settings = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Receive notifications about your assessment results',
      icon: Bell,
      value: notifications,
      onChange: () => setNotifications(!notifications)
    },
    {
      id: 'privacy',
      title: 'Enhanced Privacy',
      description: 'Keep your profile private from other users',
      icon: Shield,
      value: privacy,
      onChange: () => setPrivacy(!privacy)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

        <Card className="p-6 border-purple-100">
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Theme Preference</h3>
              <p className="text-sm text-gray-500">Choose your preferred appearance</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={darkMode === 'light' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setDarkMode('light')}
              >
                <Sun className="h-6 w-6" />
                <span>Light</span>
              </Button>
              <Button
                variant={darkMode === 'dark' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setDarkMode('dark')}
              >
                <Moon className="h-6 w-6" />
                <span>Dark</span>
              </Button>
              <Button
                variant={darkMode === 'system' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setDarkMode('system')}
              >
                <Laptop className="h-6 w-6" />
                <span>System</span>
              </Button>
            </div>
          </div>
        </Card>

        <Card className="divide-y border-purple-100">
          {settings.map((setting) => {
            const Icon = setting.icon;
            return (
              <div key={setting.id} className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={setting.id} className="text-base font-medium">
                      {setting.title}
                    </Label>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  id={setting.id}
                  checked={setting.value}
                  onCheckedChange={setting.onChange}
                />
              </div>
            );
          })}
        </Card>

        <Card className="p-6 border-purple-100">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Language & Region</h3>
            <p className="text-sm text-gray-500">Customize your experience</p>
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full justify-start" disabled>
              <Globe className="mr-2 h-4 w-4" />
              English (United States)
            </Button>
          </div>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export { SettingsScreen };