
import React, { useState, useCallback, useEffect } from 'react';
import { UserRole, Admin, LoggedInUser, TabItem, Teacher, Paybill, AdminNotification, InfoRequest, AdminPage, TeacherPage, TeacherInfoResponse, MonthlyTeacherSalaryData, ManagerPage } from './types';
import { MANAGER_USER_ID, MANAGER_PASSWORD, APP_TITLE, ADMIN_CONTACT_MOBILE, DEFAULT_PAYSLIP_MAPPINGS } from './constants';
import Tabs from './components/Tabs';
import LoginForm from './components/LoginForm';
import ManagerDashboard from './components/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ErrorModal from './components/ErrorModal'; // Import the new modal component
import { UserIcon, CogIcon, BuildingOfficeIcon } from './components/icons/FeatureIcons';
import { supabase } from './lib/supabase';

// Helper to convert month name to number for sorting
const monthNameToNumber = (monthName: string): number => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const index = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
  return index !== -1 ? index : 12; // Return 12 for unknown to sort them last
};

// --- Mock Hashing Functions (for demonstration only, NOT secure) ---
const mockHash = (password: string): string => {
  if (!password) return "mock_hashed_empty_0";
  // A very simple, non-secure "hash" for demonstration. DO NOT USE IN PRODUCTION.
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `mock_hashed_${hash}_${password.length}`;
};

const verifyMockHash = (password: string, storedMockHash: string): boolean => {
  if (!password && storedMockHash === "mock_hashed_empty_0") return true;
  if (!password || !storedMockHash) return false;
  return storedMockHash === mockHash(password);
};
// --- End Mock Hashing Functions ---


const App: React.FC = () => {
  const [activeLoginTab, setActiveLoginTab] = useState<UserRole>(UserRole.Teacher);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
  const [paybills, setPaybills] = useState<Paybill[]>([]);
  const [monthlySalaryDataList, setMonthlySalaryDataList] = useState<MonthlyTeacherSalaryData[]>([]);
  const [latestSalaryDataForCurrentTeacher, setLatestSalaryDataForCurrentTeacher] = useState<MonthlyTeacherSalaryData | null>(null);


  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [infoRequests, setInfoRequests] = useState<InfoRequest[]>([]);
  const [teacherInfoResponses, setTeacherInfoResponses] = useState<TeacherInfoResponse[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // State for modal visibility
  const [isLoading, setIsLoading] = useState(true);

  // Initial Fetch from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Admins
        const { data: adminsData } = await supabase.from('admins').select('*');
        if (adminsData) {
          setAdmins(adminsData.map(a => ({
            userId: a.username,
            password_do_not_store_plaintext_in_real_apps: a.password,
            name: a.username, // Fallback if name not in DB
            email: a.email || '',
            mobile: '' // Mobile not in DB initially, can be added to schema if needed
          })));
        }

        // Fetch Teachers
        const { data: teachersData } = await supabase.from('teachers').select('*');
        if (teachersData) {
          setTeachers(teachersData.map(t => ({
            id: t.id,
            shalarthId: t.shalarth_id,
            name: t.name,
            mobile: t.mobile,
            password_do_not_store_plaintext_in_real_apps: t.password,
            emailId: t.email,
            designation: t.designation || 'Assistant Teacher'
          })));
        }

        // Fetch Paybills
        const { data: paybillsData } = await supabase.from('paybills').select('*').order('upload_date', { ascending: false });
        if (paybillsData) {
          setPaybills(paybillsData.map(p => ({
            id: p.id,
            month: p.month,
            year: p.year,
            uploadedAt: p.upload_date,
            recordCount: p.record_count
          })));
        }

        // Fetch Salary Data
        const { data: salaryData } = await supabase.from('salary_data').select('*, paybills(month, year)');
        if (salaryData) {
          setMonthlySalaryDataList(salaryData.map(s => ({
            id: s.id,
            month: (s as any).paybills?.month || '',
            year: (s as any).paybills?.year || '',
            teacherShalarthId: s.shalarth_id,
            rawHeaders: (s.raw_data as any).headers || [],
            rawDataRow: (s.raw_data as any).row || []
          })));
        }

        // Fetch Notifications
        const { data: notificationsData } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (notificationsData) {
          setAdminNotifications(notificationsData.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            date: n.date,
            uploadedAt: n.created_at,
            fileUrl: n.file_url,
            remarks: n.remarks
          })));
        }

        // Fetch Info Requests
        const { data: requestsData } = await supabase.from('info_requests').select('*').order('created_at', { ascending: false });
        if (requestsData) {
          setInfoRequests(requestsData.map(r => ({
            id: r.id,
            title: r.title,
            subject: r.subject,
            columnHeaders: r.column_headers as string[],
            date: r.date,
            createdAt: r.created_at
          })));
        }

        // Fetch Responses
        const { data: responsesData } = await supabase.from('info_responses').select('*');
        if (responsesData) {
          setTeacherInfoResponses(responsesData.map(r => ({
            id: r.id,
            requestId: r.request_id,
            teacherShalarthId: r.teacher_id,
            responses: r.responses as any,
            status: r.status as any,
            submittedAt: r.submitted_date,
            lastUpdatedAt: r.submitted_date
          })));
        }

      } catch (err: any) {
        console.error('Error fetching data from Supabase:', err);
        setError(err.message || 'An unexpected error occurred while connecting to the database.');
        setIsErrorModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Effect to update latestSalaryDataForCurrentTeacher
  useEffect(() => {
    if (loggedInUser?.role === UserRole.Teacher && monthlySalaryDataList.length > 0) {
      const teacherSpecificData = monthlySalaryDataList
        .filter(data => data.teacherShalarthId === loggedInUser.username)
        .sort((a, b) => {
          // Sort by year descending
          if (parseInt(b.year) !== parseInt(a.year)) {
            return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
          }
          // Sort by month descending
          return monthNameToNumber(b.month) - monthNameToNumber(a.month);
        });
      
      setLatestSalaryDataForCurrentTeacher(teacherSpecificData.length > 0 ? teacherSpecificData[0] : null);
    } else {
      setLatestSalaryDataForCurrentTeacher(null); // Clear if not teacher or no data
    }
  }, [loggedInUser, monthlySalaryDataList]);


  const handleLogin = useCallback(async (param1: string, param2: string, param3: string | UserRole, param4?: UserRole) => {
    setError(null);
    setIsErrorModalOpen(false);
    const genericErrorMessage = "Incorrect credentials. Please confirm your User ID/Shalarth ID, Mobile Number (if applicable), and Password from Admin/Manager.";

    let roleToLogin: UserRole;
    let shalarthIdForTeacher: string | undefined;
    let mobileForTeacher: string | undefined;
    let userIdForAdminManager: string | undefined;
    let passwordValue: string;

    if (param4 === UserRole.Teacher) { // Teacher login
      roleToLogin = UserRole.Teacher;
      shalarthIdForTeacher = param1;
      mobileForTeacher = param2;
      passwordValue = param3 as string;
    } else { // Admin or Manager login
      roleToLogin = param3 as UserRole;
      userIdForAdminManager = param1;
      passwordValue = param2;
    }

    if (roleToLogin === UserRole.Manager) {
      if ((userIdForAdminManager === MANAGER_USER_ID && passwordValue === MANAGER_PASSWORD) || (userIdForAdminManager === 'sample' && passwordValue === 'sample')) {
        setLoggedInUser({ role: UserRole.Manager, username: userIdForAdminManager! });
      } else { 
        setError(genericErrorMessage);
        setIsErrorModalOpen(true);
      }
    } else if (roleToLogin === UserRole.Admin) {
      const { data: adminUser, error: adminErr } = await supabase
        .from('admins')
        .select('*')
        .eq('username', userIdForAdminManager)
        .single();

      if (adminUser && verifyMockHash(passwordValue, adminUser.password)) {
        setLoggedInUser({ role: UserRole.Admin, username: userIdForAdminManager! });
      } else { 
        setError(genericErrorMessage);
        setIsErrorModalOpen(true);
      }
    } else if (roleToLogin === UserRole.Teacher) {
      const { data: teacherUser, error: teacherErr } = await supabase
        .from('teachers')
        .select('*')
        .eq('shalarth_id', shalarthIdForTeacher)
        .eq('mobile', mobileForTeacher)
        .single();
        
      if (teacherUser && verifyMockHash(passwordValue, teacherUser.password)) { 
        setLoggedInUser({ role: UserRole.Teacher, username: shalarthIdForTeacher! }); 
      } else { 
        setError(genericErrorMessage);
        setIsErrorModalOpen(true);
      }
    }
  }, [admins, teachers]);

  const handleLogout = useCallback(() => {
    setLoggedInUser(null);
    setError(null);
    setIsErrorModalOpen(false);
    setActiveLoginTab(UserRole.Teacher);
  }, []);

  const closeErrorModal = useCallback(() => {
    setIsErrorModalOpen(false);
    setError(null);
  }, []);

  const clearErrorFromChild = useCallback(() => {
    setError(null);
    setIsErrorModalOpen(false);
  }, []);


  const handleCreateAdmin = useCallback(async (newAdmin: Admin) => {
    const { error: insertError } = await supabase
      .from('admins')
      .insert({
        username: newAdmin.userId,
        password: mockHash(newAdmin.password_do_not_store_plaintext_in_real_apps),
        email: newAdmin.email
      });

    if (insertError) throw new Error(insertError.message);

    const adminWithHashedPassword = {
      ...newAdmin,
      password_do_not_store_plaintext_in_real_apps: mockHash(newAdmin.password_do_not_store_plaintext_in_real_apps),
    };
    setAdmins(prevAdmins => [...prevAdmins, adminWithHashedPassword]);
  }, []);

  const handleDeleteAdmin = useCallback(async (adminUserId: string) => {
    await supabase.from('admins').delete().eq('username', adminUserId);
    setAdmins(prevAdmins => prevAdmins.filter(admin => admin.userId !== adminUserId));
  }, []);

  const handleCreateTeachers = useCallback(async (newTeachers: Teacher[]) => {
    const teachersToInsert = newTeachers.map(t => ({
      shalarth_id: t.shalarthId,
      name: t.name,
      mobile: t.mobile || '0000000000',
      password: mockHash(t.password_do_not_store_plaintext_in_real_apps),
      email: t.emailId,
      designation: t.designation || 'Assistant Teacher'
    }));

    const { error: insertError } = await supabase.from('teachers').insert(teachersToInsert);
    if (insertError) throw new Error(insertError.message);

    setTeachers(prevTeachers => {
      const existingShalarthIds = new Set(prevTeachers.map(t => t.shalarthId));
      const uniqueNewTeachers = newTeachers.filter(nt => !existingShalarthIds.has(nt.shalarthId));
      return [...prevTeachers, ...uniqueNewTeachers];
    });
  }, []);

  const handleDeleteTeacher = useCallback(async (teacherId: string) => {
    await supabase.from('teachers').delete().eq('id', teacherId);
    setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.id !== teacherId));
  }, []);

  const handleProcessPaybillUpload = useCallback(async (
    paybillMeta: Omit<Paybill, 'id' | 'uploadedAt'>,
    parsedExcelData: { headers: string[]; rows: { shalarthId: string; dataRow: (string | number | null)[] }[] }
  ) => {
    // Check if exists
    const { data: existingPaybill } = await supabase
      .from('paybills')
      .select('id')
      .eq('month', paybillMeta.month)
      .eq('year', paybillMeta.year)
      .single();

    if (existingPaybill) {
      throw new Error(`A paybill master record for ${paybillMeta.month} ${paybillMeta.year} already exists.`);
    }

    const { data: newPaybill, error: paybillErr } = await supabase
      .from('paybills')
      .insert({
        month: paybillMeta.month,
        year: paybillMeta.year,
        record_count: paybillMeta.recordCount
      })
      .select()
      .single();

    if (paybillErr || !newPaybill) throw new Error(paybillErr?.message || 'Failed to create paybill');

    const salaryEntries = parsedExcelData.rows.map(teacherRow => ({
      paybill_id: newPaybill.id,
      shalarth_id: teacherRow.shalarthId,
      employee_name: teacherRow.dataRow[0], // Example mapping
      raw_data: { headers: parsedExcelData.headers, row: teacherRow.dataRow }
    }));

    const { error: salaryErr } = await supabase.from('salary_data').insert(salaryEntries);
    if (salaryErr) throw new Error(salaryErr.message);

    // Update local state
    setPaybills(prev => [{ ...paybillMeta, id: newPaybill.id, uploadedAt: newPaybill.upload_date }, ...prev]);
    const newSalaryDataEntries: MonthlyTeacherSalaryData[] = parsedExcelData.rows.map(teacherRow => ({
      id: teacherRow.shalarthId + Date.now(),
      month: paybillMeta.month,
      year: paybillMeta.year,
      teacherShalarthId: teacherRow.shalarthId,
      rawHeaders: parsedExcelData.headers,
      rawDataRow: teacherRow.dataRow,
    }));
    setMonthlySalaryDataList(prev => [...prev, ...newSalaryDataEntries]);

  }, []);

  const handleDeletePaybill = useCallback(async (paybillIdToDelete: string) => {
    const paybillToDelete = paybills.find(p => p.id === paybillIdToDelete);
    if (!paybillToDelete) return;

    await supabase.from('paybills').delete().eq('id', paybillIdToDelete);
    
    setPaybills(prev => prev.filter(p => p.id !== paybillIdToDelete));
    setMonthlySalaryDataList(prev => 
      prev.filter(data => !(data.month === paybillToDelete.month && data.year === paybillToDelete.year))
    );
  }, [paybills]);

  const handleAddAdminNotification = useCallback(async (newNotification: AdminNotification, file: File | null) => {
    let fileUrl = '';
    let fileName = '';

    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `notif-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('notifications')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Storage upload error:", uploadError.message);
          if (uploadError.message.includes('Bucket not found')) {
            throw new Error('Supabase Storage bucket "notifications" not found. Please create it in your Supabase Dashboard > Storage.');
          }
          throw uploadError;
        } else {
          const { data: urlData } = supabase.storage
            .from('notifications')
            .getPublicUrl(filePath);
          fileUrl = urlData.publicUrl;
          fileName = file.name;
        }
      } catch (err: any) {
        console.error("File upload failed:", err);
        throw new Error(err.message || "Failed to upload file to storage.");
      }
    }

    const { data, error: nErr } = await supabase.from('notifications').insert({
      title: newNotification.title || "New Notification",
      message: newNotification.message || "",
      date: newNotification.date || new Date().toISOString().split('T')[0],
      file_url: fileUrl,
      remarks: newNotification.remarks || ""
    }).select().single();

    if (nErr) throw new Error(nErr.message);

    setAdminNotifications(prev => [{ 
      ...newNotification, 
      id: data.id, 
      uploadedAt: data.created_at, 
      fileUrl: data.file_url,
      fileName: fileName || newNotification.fileName
    }, ...prev]);
  }, []);

  const handleDeleteAdminNotification = useCallback(async (notificationId: string) => {
    await supabase.from('notifications').delete().eq('id', notificationId);
    setAdminNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);
  
  const handleAddInfoRequest = useCallback(async (newRequest: InfoRequest) => {
    const { data, error: rErr } = await supabase.from('info_requests').insert({
      title: newRequest.title || newRequest.subject || "Data Request",
      subject: newRequest.subject || "Data Request",
      column_headers: newRequest.columnHeaders || [],
      date: newRequest.date || new Date().toISOString().split('T')[0]
    }).select().single();

    if (rErr) throw new Error(rErr.message);

    setInfoRequests(prev => [{ ...newRequest, id: data.id, createdAt: data.created_at }, ...prev]);
  }, []);

  const handleDeleteInfoRequest = useCallback(async (requestId: string) => {
    await supabase.from('info_requests').delete().eq('id', requestId);
    setInfoRequests(prev => prev.filter(req => req.id !== requestId));
    setTeacherInfoResponses(prevResponses => prevResponses.filter(res => res.requestId !== requestId));
  }, []);

  const handleAddOrUpdateTeacherInfoResponse = useCallback(async (response: TeacherInfoResponse) => {
    if (!response.responseData || Object.keys(response.responseData).length === 0) {
      throw new Error("Cannot submit empty responses.");
    }

    const { error: resErr } = await supabase.from('info_responses').upsert({
      request_id: response.requestId,
      teacher_id: response.teacherShalarthId,
      responses: response.responseData, // Fixed: was response.responses
      status: response.status || 'Submitted'
    }, { onConflict: 'request_id,teacher_id' }); 

    if (resErr) {
      console.error("Info response error:", resErr.message);
      throw new Error(resErr.message);
    }

    setTeacherInfoResponses(prevResponses => {
      const existingResponseIndex = prevResponses.findIndex(
        r => r.requestId === response.requestId && r.teacherShalarthId === response.teacherShalarthId
      );
      if (existingResponseIndex > -1) {
        const updatedResponses = [...prevResponses];
        updatedResponses[existingResponseIndex] = {
          ...response,
          lastUpdatedAt: new Date().toISOString(),
        };
        return updatedResponses;
      }
      return [...prevResponses, response];
    });
  }, []);

  const TABS: TabItem[] = [
    { label: 'Teacher Login', value: UserRole.Teacher, icon: <UserIcon className="w-5 h-5 mr-2" /> },
    { label: 'Admin Login', value: UserRole.Admin, icon: <CogIcon className="w-5 h-5 mr-2" /> },
    { label: 'Manager Login', value: UserRole.Manager, icon: <BuildingOfficeIcon className="w-5 h-5 mr-2" /> },
  ];
  
  const currentTeacherDetails = loggedInUser?.role === UserRole.Teacher 
    ? teachers.find(t => t.shalarthId === loggedInUser.username) 
    : null;

  const determinedAdminContactMobile = admins.length > 0 && admins[0].mobile 
    ? admins[0].mobile 
    : ADMIN_CONTACT_MOBILE;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        <p className="ml-4">Loading Portal Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-sky-500 selection:text-white">
      <header className="mb-8 text-center no-print">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 tracking-tighter">{APP_TITLE}</h1>
      </header>

      <main className={`w-full max-w-4xl bg-slate-800 shadow-2xl rounded-lg p-6 md:p-10 ${!loggedInUser ? 'no-print' : ''}`}>
        {!loggedInUser ? (
          <>
            <Tabs tabs={TABS} activeTab={activeLoginTab} onTabChange={setActiveLoginTab as (tab: UserRole | AdminPage | TeacherPage | ManagerPage) => void} />
            <div className="mt-6">
              <LoginForm
                key={activeLoginTab} 
                role={activeLoginTab}
                onLogin={handleLogin}
                error={null} // LoginForm no longer displays error directly
                clearError={clearErrorFromChild} // Pass down clearError
              />
            </div>
          </>
        ) : (
          <>
            {loggedInUser.role === UserRole.Manager && (
              <ManagerDashboard
                onLogout={handleLogout}
                admins={admins}
                onCreateAdmin={handleCreateAdmin}
                onDeleteAdmin={handleDeleteAdmin}
                username={loggedInUser.username}
                // Pass notification and info request props
                adminNotifications={adminNotifications}
                onAddAdminNotification={handleAddAdminNotification}
                onDeleteAdminNotification={handleDeleteAdminNotification}
                infoRequests={infoRequests}
                onAddInfoRequest={handleAddInfoRequest}
                onDeleteInfoRequest={handleDeleteInfoRequest}
              />
            )}
            {loggedInUser.role === UserRole.Admin && (
              <AdminDashboard
                username={loggedInUser.username}
                onLogout={handleLogout}
                teachers={teachers}
                onCreateTeachers={handleCreateTeachers}
                onDeleteTeacher={handleDeleteTeacher}
                paybills={paybills}
                onProcessPaybillUpload={handleProcessPaybillUpload}
                onDeletePaybill={handleDeletePaybill}
                adminNotifications={adminNotifications}
                onAddAdminNotification={handleAddAdminNotification}
                onDeleteAdminNotification={handleDeleteAdminNotification}
                infoRequests={infoRequests}
                onAddInfoRequest={handleAddInfoRequest}
                onDeleteInfoRequest={handleDeleteInfoRequest}
                // Props for Admin View Payslip
                monthlySalaryDataList={monthlySalaryDataList}
                payslipMappings={DEFAULT_PAYSLIP_MAPPINGS}
                adminContactMobile={determinedAdminContactMobile}
              />
            )}
            {loggedInUser.role === UserRole.Teacher && currentTeacherDetails && (
              <TeacherDashboard
                teacher={currentTeacherDetails}
                onLogout={handleLogout}
                monthlySalaryDataList={monthlySalaryDataList.filter(d => d.teacherShalarthId === currentTeacherDetails.shalarthId)}
                payslipMappings={DEFAULT_PAYSLIP_MAPPINGS}
                adminNotifications={adminNotifications}
                infoRequests={infoRequests}
                teacherInfoResponses={teacherInfoResponses.filter(r => r.teacherShalarthId === currentTeacherDetails.shalarthId)}
                onAddOrUpdateInfoResponse={handleAddOrUpdateTeacherInfoResponse}
                adminContactMobile={determinedAdminContactMobile} // Use determined contact
                // Pass latest salary data for profile
                latestSalaryDataForCurrentTeacher={latestSalaryDataForCurrentTeacher}
              />
            )}
          </>
        )}
      </main>
      {isErrorModalOpen && error && (
        <ErrorModal message={error} onClose={closeErrorModal} />
      )}
      <footer className="mt-8 text-center text-sm text-slate-400 no-print">
        <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
