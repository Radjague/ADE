// تهيئة Firebase
document.addEventListener('DOMContentLoaded', function() {
  // تكوين Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBo6n3eTC1HFMFwrAxX-Vp48ollpkUruLo",
    authDomain: "ade1-6e25b.firebaseapp.com",
    projectId: "ade1-6e25b",
    storageBucket: "ade1-6e25b.firebasestorage.app",
    messagingSenderId: "786106634887",
    appId: "1:786106634887:web:7cc780fb5007e200df1e22",
      measurementId: "G-FY0Q3H378H"
  };

  // تهيئة Firebase
  firebase.initializeApp(firebaseConfig);

  // التحقق من حالة المستخدم عند تحميل الصفحة
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // المستخدم مسجل الدخول
      console.log("المستخدم مسجل الدخول:", user.uid);
      checkUserRole(user.uid);
    } else {
      // المستخدم غير مسجل الدخول
      console.log("المستخدم غير مسجل الدخول");
      showMainPage();
    }
  });
});

// دالة للتحقق من دور المستخدم
function checkUserRole(userId) {
  firebase.firestore().collection('users').doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        if (userData.role === 'citizen') {
          showCitizenDashboard(userData);
        } else if (userData.role === 'worker') {
          showWorkerDashboard(userData);
        } else {
          console.error("دور المستخدم غير معروف:", userData.role);
          showMainPage();
        }
      } else {
        console.error("بيانات المستخدم غير موجودة في Firestore");
        showMainPage();
      }
    })
    .catch((error) => {
      console.error("خطأ في الحصول على بيانات المستخدم:", error);
      showMainPage();
    });
}

// دالة لإظهار الصفحة الرئيسية
function showMainPage() {
  document.getElementById("mainPage").style.display = "block";
  document.getElementById("welcomePage").style.display = "none";
  document.getElementById("registrationButtons").style.display = "flex";
}

// دالة لإظهار لوحة تحكم المواطن
function showCitizenDashboard(userData) {
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("welcomePage").style.display = "block";
  document.getElementById("userName").textContent = userData.name || "عزيزي المواطن";
  
  // تحميل البيانات الخاصة بالمواطن (الفواتير، الديون، إلخ)
  loadCitizenData(userData);
}

// دالة لإظهار لوحة تحكم العامل
function showWorkerDashboard(userData) {
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("welcomePage").style.display = "block";
  document.getElementById("userName").textContent = userData.name || "عزيزي العامل";
  
  // تحميل البيانات الخاصة بالعامل (الشكاوى، الوكالات، إلخ)
  // سيتم تنفيذها لاحقاً
}

// دالة لتحميل بيانات المواطن
function loadCitizenData(userData) {
  // تحميل الفواتير
  loadBills(userData.subscriberNumber);
  
  // تحميل الديون
  loadDebts(userData.subscriberNumber);
  
  // تحميل التنبيهات
  loadNotifications(userData.uid);
}

// دالة لتحميل الفواتير
function loadBills(subscriberNumber) {
  if (!subscriberNumber) return;
  
  firebase.firestore().collection('bills')
    .where('subscriberNumber', '==', subscriberNumber)
    .orderBy('issueDate', 'desc')
    .get()
    .then((querySnapshot) => {
      // سيتم تنفيذ عرض الفواتير لاحقاً
      console.log("تم تحميل الفواتير:", querySnapshot.size);
    })
    .catch((error) => {
      console.error("خطأ في تحميل الفواتير:", error);
    });
}

// دالة لتحميل الديون
function loadDebts(subscriberNumber) {
  if (!subscriberNumber) return;
  
  firebase.firestore().collection('bills')
    .where('subscriberNumber', '==', subscriberNumber)
    .where('status', '==', 'unpaid')
    .get()
    .then((querySnapshot) => {
      // سيتم تنفيذ عرض الديون لاحقاً
      console.log("تم تحميل الديون:", querySnapshot.size);
    })
    .catch((error) => {
      console.error("خطأ في تحميل الديون:", error);
    });
}

// دالة لتحميل التنبيهات
function loadNotifications(userId) {
  firebase.firestore().collection('notifications')
    .where('targetUserIds', 'array-contains', userId)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get()
    .then((querySnapshot) => {
      // سيتم تنفيذ عرض التنبيهات لاحقاً
      console.log("تم تحميل التنبيهات:", querySnapshot.size);
    })
    .catch((error) => {
      console.error("خطأ في تحميل التنبيهات:", error);
    });
}

// ===== وظائف المصادقة =====

// فتح نافذة تسجيل المواطن
function openCitizenModal() {
  document.getElementById("citizenModal").style.display = "block";
}

// فتح نافذة تسجيل العامل
function openWorkerModal() {
  // سيتم تنفيذها لاحقاً - نافذة تسجيل العامل
  alert("سيتم تفعيل تسجيل العاملين قريباً");
}

// إغلاق نافذة تسجيل المواطن
function closeCitizenModal() {
  document.getElementById("citizenModal").style.display = "none";
}

// إغلاق نافذة تسجيل دخول المواطن
function closeCitizenLogin() {
  document.getElementById("citizenLogin").style.display = "none";
}

// إغلاق جميع النوافذ المنبثقة
function closeAllModals() {
  document.getElementById("citizenModal").style.display = "none";
  document.getElementById("citizenLogin").style.display = "none";
  document.getElementById("citizenSignup").style.display = "none";
}

// إظهار نموذج تسجيل دخول المواطن
function showCitizenLogin() {
  document.getElementById("citizenModal").style.display = "none";
  document.getElementById("citizenLogin").style.display = "block";
}

// إظهار نموذج إنشاء حساب المواطن
function showCitizenSignup() {
  document.getElementById("citizenModal").style.display = "none";
  document.getElementById("citizenSignup").style.display = "block";
}

// تسجيل دخول المواطن
function submitCitizenLogin() {
  const email = document.getElementById("citizenEmail").value;
  const password = document.getElementById("citizenPassword").value;
  
  if (!email || !password) {
    alert("يرجى ملء جميع الحقول المطلوبة");
    return;
  }
  
  // تسجيل الدخول باستخدام Firebase Authentication
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // تم تسجيل الدخول بنجاح
      closeAllModals();
      // سيتم التحقق من دور المستخدم وعرض اللوحة المناسبة تلقائياً من خلال onAuthStateChanged
    })
    .catch((error) => {
      console.error("خطأ في تسجيل الدخول:", error);
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "البريد الإلكتروني غير صالح";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "تم تعطيل الحساب مؤقتاً بسبب محاولات تسجيل دخول متكررة. يرجى المحاولة لاحقاً.";
      }
      
      alert(errorMessage);
    });
}

// إنشاء حساب مواطن جديد
function submitCitizenSignup() {
  const name = document.getElementById("citizenName").value;
  const email = document.getElementById("citizenSignupEmail").value;
  const password = document.getElementById("citizenSignupPassword").value;
  
  if (!name || !email || !password) {
    alert("يرجى ملء جميع الحقول المطلوبة");
    return;
  }
  
  if (password.length < 6) {
    alert("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل");
    return;
  }
  
  // إنشاء حساب جديد باستخدام Firebase Authentication
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // تم إنشاء الحساب بنجاح
      const user = userCredential.user;
      
      // تحديث اسم المستخدم في Firebase Authentication
      return user.updateProfile({
        displayName: name
      }).then(() => {
        // إضافة بيانات المستخدم إلى Firestore
        return firebase.firestore().collection('users').doc(user.uid).set({
          uid: user.uid,
          name: name,
          email: email,
          role: 'citizen',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    })
    .then(() => {
      closeAllModals();
      alert("تم إنشاء الحساب بنجاح!");
      // سيتم التحقق من دور المستخدم وعرض اللوحة المناسبة تلقائياً من خلال onAuthStateChanged
    })
    .catch((error) => {
      console.error("خطأ في إنشاء الحساب:", error);
      let errorMessage = "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "البريد الإلكتروني مستخدم بالفعل";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "البريد الإلكتروني غير صالح";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "كلمة المرور ضعيفة جداً";
      }
      
      alert(errorMessage);
    });
}

// تسجيل الخروج
function logout() {
  firebase.auth().signOut()
    .then(() => {
      // تم تسجيل الخروج بنجاح
      showMainPage();
    })
    .catch((error) => {
      console.error("خطأ في تسجيل الخروج:", error);
      alert("حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.");
    });
}

// ===== وظائف دفع الفاتورة =====

// فتح نافذة الدفع
function openPaymentModal() {
  document.getElementById("paymentModal").style.display = "block";
}

// إغلاق نافذة الدفع
function closePaymentModal() {
  document.getElementById("paymentModal").style.display = "none";
}

// تقديم طلب الدفع
function submitPayment() {
  const subscriberCode = document.getElementById("subscriberCode").value;
  const invoiceNumber = document.getElementById("invoiceNumber").value;
  const trimester = document.getElementById("trimester").value;
  const year = document.getElementById("year").value;
  const amount = document.getElementById("amount").value;
  const paymentKey = document.getElementById("paymentKey").value;
  
  if (!subscriberCode || !invoiceNumber || !trimester || !year || !amount || !paymentKey) {
    alert("يرجى ملء جميع الحقول المطلوبة");
    return;
  }
  
  // التحقق من وجود المستخدم الحالي
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    alert("يجب تسجيل الدخول أولاً لإتمام عملية الدفع");
    closePaymentModal();
    openCitizenModal();
    return;
  }
  
  // البحث عن الفاتورة في Firestore
  firebase.firestore().collection('bills')
    .where('subscriberNumber', '==', subscriberCode)
    .where('invoiceNumber', '==', invoiceNumber)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        // إنشاء فاتورة جديدة إذا لم تكن موجودة
        return createNewBill(currentUser.uid, subscriberCode, invoiceNumber, trimester, year, amount, paymentKey);
      } else {
        // تحديث الفاتورة الموجودة
        const billDoc = querySnapshot.docs[0];
        return updateExistingBill(billDoc.id);
      }
    })
    .then(() => {
      // إنشاء سجل دفع جديد
      return createPaymentRecord(currentUser.uid, subscriberCode, invoiceNumber, amount);
    })
    .then(() => {
      alert("تم دفع الفاتورة بنجاح!");
      closePaymentModal();
    })
    .catch((error) => {
      console.error("خطأ في عملية الدفع:", error);
      alert("حدث خطأ أثناء عملية الدفع. يرجى المحاولة مرة أخرى.");
    });
}

// إنشاء فاتورة جديدة
function createNewBill(userId, subscriberNumber, invoiceNumber, period, year, amount, paymentKey) {
  return firebase.firestore().collection('bills').add({
    userId: userId,
    subscriberNumber: subscriberNumber,
    invoiceNumber: invoiceNumber,
    period: period,
    year: parseInt(year),
    amount: parseFloat(amount),
    paymentKey: paymentKey,
    status: 'paid',
    dueDate: firebase.firestore.Timestamp.fromDate(new Date()),
    issueDate: firebase.firestore.Timestamp.fromDate(new Date()),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// تحديث فاتورة موجودة
function updateExistingBill(billId) {
  return firebase.firestore().collection('bills').doc(billId).update({
    status: 'paid',
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// إنشاء سجل دفع
function createPaymentRecord(userId, subscriberNumber, invoiceNumber, amount) {
  return firebase.firestore().collection('payments').add({
    userId: userId,
    subscriberNumber: subscriberNumber,
    invoiceNumber: invoiceNumber,
    amountPaid: parseFloat(amount),
    paymentDate: firebase.firestore.FieldValue.serverTimestamp(),
    paymentMethod: 'online_firebase',
    transactionId: 'TR' + Date.now(),
    status: 'success',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// ===== وظائف الشكاوى =====

// فتح نافذة الشكوى
function openComplaintModal() {
  document.getElementById("complaintModal").style.display = "block";
}

// إغلاق نافذة الشكوى
function closeComplaintModal() {
  document.getElementById("complaintModal").style.display = "none";
}

// فتح الخريطة لتحديد الموقع
function openMap() {
  // سيتم تنفيذها لاحقاً - فتح الخريطة لتحديد الموقع
  alert("سيتم تفعيل خدمة تحديد الموقع قريباً");
  
  // تحديث حالة الموقع (للتجربة فقط)
  document.getElementById("locationStatus").style.display = "block";
  
  // تعيين إحداثيات افتراضية (للتجربة فقط)
  document.getElementById("latitude").value = "36.7538";
  document.getElementById("longitude").value = "3.0588";
}

// تقديم الشكوى
document.addEventListener('DOMContentLoaded', function() {
  const complaintForm = document.getElementById("internalComplaintForm");
  if (complaintForm) {
    complaintForm.addEventListener("submit", function(e) {
      e.preventDefault();
      submitComplaint();
    });
  }
});

function submitComplaint() {
  // التحقق من وجود المستخدم الحالي
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    alert("يجب تسجيل الدخول أولاً لإرسال شكوى");
    closeComplaintModal();
    openCitizenModal();
    return;
  }
  
  const subscriberNumber = document.getElementById("subscriberNumber").value;
  const wilaya = document.getElementById("wilaya").value;
  const address = document.getElementById("address").value;
  const imageUrl = document.getElementById("imageInput").value;
  const complaintText = document.getElementById("complaintText").value;
  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;
  
  if (!subscriberNumber || !wilaya || !address || !complaintText) {
    alert("يرجى ملء جميع الحقول المطلوبة");
    return;
  }
  
  // الحصول على بيانات المستخدم من Firestore
  firebase.firestore().collection('users').doc(currentUser.uid).get()
    .then((doc) => {
      let userName = currentUser.displayName || "";
      let userEmail = currentUser.email || "";
      
      if (doc.exists) {
        const userData = doc.data();
        userName = userData.name || userName;
        userEmail = userData.email || userEmail;
      }
      
      // إضافة الشكوى إلى Firestore
      return firebase.firestore().collection('complaints').add({
        userId: currentUser.uid,
        userName: userName,
        userEmail: userEmail,
        subscriberNumber: subscriberNumber,
        wilaya: wilaya,
        address: address,
        complaintText: complaintText,
        imageUrl: imageUrl || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        status: 'submitted',
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert("تم إرسال الشكوى بنجاح!");
      closeComplaintModal();
      
      // إعادة تعيين النموذج
      document.getElementById("internalComplaintForm").reset();
      document.getElementById("locationStatus").style.display = "none";
    })
    .catch((error) => {
      console.error("خطأ في إرسال الشكوى:", error);
      alert("حدث خطأ أثناء إرسال الشكوى. يرجى المحاولة مرة أخرى.");
    });
}

// ===== وظائف الوكالات =====

// فتح نافذة الوكالات
function openAgenciesModal() {
  document.getElementById("agenciesModal").style.display = "block";
  loadWilayaOptions();
}

// إغلاق نافذة الوكالات
function closeAgenciesModal() {
  document.getElementById("agenciesModal").style.display = "none";
}

// تحميل خيارات الولايات
function loadWilayaOptions() {
  // يمكن تحميل الولايات من Firestore إذا كانت مخزنة هناك
  // للتبسيط، نستخدم القائمة الموجودة بالفعل في HTML
}

// تحميل الوكالات حسب الولاية
function loadAgencies() {
  const wilaya = document.getElementById("wilayaSelect").value;
  
  if (!wilaya) {
    document.getElementById("agenciesList").innerHTML = "<p>يرجى اختيار الولاية أولاً</p>";
    return;
  }
  
  document.getElementById("agenciesList").innerHTML = "<p>جاري تحميل الوكالات...</p>";
  
  firebase.firestore().collection('agencies')
    .where('wilaya', '==', wilaya)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        document.getElementById("agenciesList").innerHTML = "<p>لا توجد وكالات متاحة في هذه الولاية</p>";
        return;
      }
      
      let agenciesHTML = "";
      querySnapshot.forEach((doc) => {
        const agency = doc.data();
        agenciesHTML += `
          <div class="agency-card">
            <h3>${agency.name}</h3>
            <p><strong>العنوان:</strong> ${agency.address}</p>
            <p><strong>الهاتف:</strong> ${agency.phone || 'غير متوفر'}</p>
            <p><strong>ساعات العمل:</strong> ${agency.openingHours || 'غير متوفر'}</p>
          </div>
        `;
      });
      
      document.getElementById("agenciesList").innerHTML = agenciesHTML;
    })
    .catch((error) => {
      console.error("خطأ في تحميل الوكالات:", error);
      document.getElementById("agenciesList").innerHTML = "<p>حدث خطأ أثناء تحميل الوكالات. يرجى المحاولة مرة أخرى.</p>";
    });
}

// ===== وظائف التنبيهات والديون =====

// فتح نافذة التنبيهات
function showModal(modalId) {
  document.getElementById(modalId).style.display = "block";
  
  if (modalId === 'notificationsModal') {
    loadUserNotifications();
  } else if (modalId === 'debtsModal') {
    loadUserDebts();
  }
}

// إغلاق النافذة المنبثقة
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// تحميل تنبيهات المستخدم
function loadUserNotifications() {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) return;
  
  const notificationsModal = document.getElementById('notificationsModal');
  const modalContent = notificationsModal.querySelector('.modal-content');
  
  // إضافة عنوان ورسالة تحميل
  modalContent.innerHTML = `
    <span class="close" onclick="closeModal('notificationsModal')">&times;</span>
    <h2>التنبيهات</h2>
    <p>جاري تحميل التنبيهات...</p>
  `;
  
  firebase.firestore().collection('notifications')
    .where('targetUserIds', 'array-contains', currentUser.uid)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        modalContent.innerHTML = `
          <span class="close" onclick="closeModal('notificationsModal')">&times;</span>
          <h2>التنبيهات</h2>
          <p>لا توجد تنبيهات جديدة</p>
        `;
        return;
      }
      
      let notificationsHTML = `
        <span class="close" onclick="closeModal('notificationsModal')">&times;</span>
        <h2>التنبيهات</h2>
      `;
      
      querySnapshot.forEach((doc) => {
        const notification = doc.data();
        const date = notification.createdAt ? notification.createdAt.toDate().toLocaleDateString('ar-DZ') : 'غير معروف';
        
        notificationsHTML += `
          <div class="notification-item">
            <h3>${notification.title}</h3>
            <p>${notification.message}</p>
            <small>تاريخ: ${date}</small>
          </div>
        `;
      });
      
      modalContent.innerHTML = notificationsHTML;
    })
    .catch((error) => {
      console.error("خطأ في تحميل التنبيهات:", error);
      modalContent.innerHTML = `
        <span class="close" onclick="closeModal('notificationsModal')">&times;</span>
        <h2>التنبيهات</h2>
        <p>حدث خطأ أثناء تحميل التنبيهات. يرجى المحاولة مرة أخرى.</p>
      `;
    });
}

// تحميل ديون المستخدم
function loadUserDebts() {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) return;
  
  // الحصول على رقم المشترك من بيانات المستخدم
  firebase.firestore().collection('users').doc(currentUser.uid).get()
    .then((doc) => {
      if (!doc.exists) {
        throw new Error("بيانات المستخدم غير موجودة");
      }
      
      const userData = doc.data();
      const subscriberNumber = userData.subscriberNumber;
      
      if (!subscriberNumber) {
        throw new Error("رقم المشترك غير متوفر");
      }
      
      // تحميل الفواتير غير المدفوعة
      return firebase.firestore().collection('bills')
        .where('subscriberNumber', '==', subscriberNumber)
        .where('status', '==', 'unpaid')
        .orderBy('dueDate', 'asc')
        .get();
    })
    .then((querySnapshot) => {
      const debtsModal = document.getElementById('debtsModal');
      const modalContent = debtsModal.querySelector('.modal-content');
      
      if (querySnapshot.empty) {
        modalContent.innerHTML = `
          <span class="close" onclick="closeModal('debtsModal')">&times;</span>
          <h2>الديون</h2>
          <p>لا توجد ديون مستحقة</p>
        `;
        return;
      }
      
      let debtsHTML = `
        <span class="close" onclick="closeModal('debtsModal')">&times;</span>
        <h2>الديون</h2>
        <table class="debts-table">
          <thead>
            <tr>
              <th>رقم الفاتورة</th>
              <th>الفترة</th>
              <th>السنة</th>
              <th>المبلغ (دج)</th>
              <th>تاريخ الاستحقاق</th>
              <th>الإجراء</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      let totalDebt = 0;
      
      querySnapshot.forEach((doc) => {
        const bill = doc.data();
        const dueDate = bill.dueDate ? bill.dueDate.toDate().toLocaleDateString('ar-DZ') : 'غير معروف';
        totalDebt += bill.amount;
        
        debtsHTML += `
          <tr>
            <td>${bill.invoiceNumber}</td>
            <td>${bill.period}</td>
            <td>${bill.year}</td>
            <td>${bill.amount.toFixed(2)}</td>
            <td>${dueDate}</td>
            <td><button onclick="payBill('${doc.id}')">دفع</button></td>
          </tr>
        `;
      });
      
      debtsHTML += `
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"><strong>المجموع</strong></td>
              <td colspan="3"><strong>${totalDebt.toFixed(2)} دج</strong></td>
            </tr>
          </tfoot>
        </table>
      `;
      
      modalContent.innerHTML = debtsHTML;
    })
    .catch((error) => {
      console.error("خطأ في تحميل الديون:", error);
      
      const debtsModal = document.getElementById('debtsModal');
      const modalContent = debtsModal.querySelector('.modal-content');
      
      modalContent.innerHTML = `
        <span class="close" onclick="closeModal('debtsModal')">&times;</span>
        <h2>الديون</h2>
        <p>حدث خطأ أثناء تحميل الديون: ${error.message}</p>
      `;
    });
}

// دفع فاتورة محددة
function payBill(billId) {
  // فتح نافذة الدفع مع تعبئة بيانات الفاتورة
  firebase.firestore().collection('bills').doc(billId).get()
    .then((doc) => {
      if (!doc.exists) {
        throw new Error("الفاتورة غير موجودة");
      }
      
      const bill = doc.data();
      
      // تعبئة نموذج الدفع
      document.getElementById("subscriberCode").value = bill.subscriberNumber;
      document.getElementById("invoiceNumber").value = bill.invoiceNumber;
      document.getElementById("trimester").value = bill.period;
      document.getElementById("year").value = bill.year;
      document.getElementById("amount").value = bill.amount;
      document.getElementById("paymentKey").value = bill.paymentKey || '';
      
      // إغلاق نافذة الديون وفتح نافذة الدفع
      closeModal('debtsModal');
      openPaymentModal();
    })
    .catch((error) => {
      console.error("خطأ في تحميل بيانات الفاتورة:", error);
      alert("حدث خطأ أثناء تحميل بيانات الفاتورة. يرجى المحاولة مرة أخرى.");
    });
}

// دالة لإخفاء جميع الأقسام
function hideAllSections() {
    document.getElementById("imageContainer").style.display = "none";
    document.getElementById("info-box").style.display = "none";
    document.getElementById("answer-box").style.display = "none";
    document.getElementById("contact-section").style.display = "none";
    document.querySelector(".buttons-container").style.display = "none"; // إخفاء الأزرار
    document.querySelector(".carousel-container").style.display = "none"; // إخفاء قسم تمرير البطاقات
    document.getElementById("content").style.display = "none"; // ✅ إخفاء منطقة عرض المحتوى
    document.getElementById("complaint-section").style.display = "none";   // جديد
}

// دالة لإظهار معلومات عن الشركة
function showInfo(type) {
    hideAllSections();
    let infoBox = document.getElementById("info-box");
    
    if (type === "نبذة") {
        infoBox.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
                <div style="flex: 1; padding-right: 20px;">
                    <h2 style="color: #0056b3;">نبذة عن الشركة</h2>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        الجزائرية للمياه هي مؤسسة عمومية ذات طابع صناعي وتجاري تم إنشاؤها بموجب المرسوم التنفيذي رقم 101-01 المؤرخ في 21 أفريل 2001، في إطار الإصلاح المؤسساتي الذي قامت به الحكومة. تشمل الجزائرية للمياه خمسة عشر (15) منطقة.. 
                        وتنتج المؤسسة وتوزع 5.5 مليون متر مكعب من مياه الشرب يوميًا لتزويد أكثر من 28.5 مليون ساكن بالماء الشروب عبر التراب الوطني. تأتي المياه التي تنتجها وتوزعها الجزائرية للمياه من ثلاثة مصادر مختلفة وهي: 
                        المياه الجوفية بنسبة 45٪، المياه السطحية بنسبة 39٪، والمياه المحلاة بنسبة 16٪.
                    </p>
                </div>
                <div style="flex: 1; text-align: center;">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR5AGPEn63FT6SsXwaUSCZhefpn6iNDfk2aQ&s" alt="الجزائرية للمياه" style="max-width: 100%; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);">
                </div>
            </div>
            <!-- باقي المحتوى -->
        `;
    } else if (type === "الرؤية") {
        infoBox.innerHTML = `
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 800px; margin: auto; text-align: right; font-family: Arial, sans-serif;">
                <h2 style="color: black; font-weight: bold; text-align: center;"> الاستراتيجية: </h2>
                <!-- باقي المحتوى -->
            </div>
        `;
    }
    
    infoBox.style.display = "block";
}

// دالة لإظهار إجابة الأسئلة الشائعة
function showAnswer(question) {
    hideAllSections();
    let answerBox = document.getElementById("answer-box");
    
    if (question === "q1") {
        answerBox.innerHTML = `
            <h2 style="color:#005bbb;">تريد توصيل منزلك بشبكة مياه الشرب ADE، إليك ما عليك فعله!</h2>
            <!-- باقي المحتوى -->
        `;
    } else if (question === "q2") {
        answerBox.innerHTML = `
            <h2 style="color:#005bbb;">هل المياه التي توزعها شركة ADE ذات نوعية جيدة؟</h2>
            <!-- باقي المحتوى -->
        `;
    } else if (question === "q3") {
        answerBox.innerHTML = `
            <h2 style="color:#005bbb;">طرق الدفع</h2>
            <!-- باقي المحتوى -->
        `;
    }
    
    answerBox.style.display = "block";
}

// دالة لإظهار/إخفاء قسم الاتصال
function toggleContact() {
    hideAllSections();
    let contactSection = document.getElementById("contact-section");
    
    if (contactSection.style.display === "none" || contactSection.style.display === "") {
        contactSection.style.display = "block";
    } else {
        contactSection.style.display = "none";
        document.querySelector(".buttons-container").style.display = "flex"; // إظهار الأزرار عند إخفاء القسم
    }
}

// دالة لإظهار قسم الشكوى
function openComplaintSection() {
    hideAllSections();
    document.getElementById("complaint-section").style.display = "block";
}

// معالجة نموذج الشكوى الخارجي
document.addEventListener('DOMContentLoaded', function() {
    const complaintForm = document.getElementById("complaintForm");
    if (complaintForm) {
        complaintForm.addEventListener("submit", function(e) {
            e.preventDefault();
            saveExternalComplaint();
        });
    }
});

function saveExternalComplaint() {
    const fullName = document.getElementById("fullName").value;
    const wilaya = document.getElementById("wilaya").value;
    const subscriberNo = document.getElementById("subscriberNo").value;
    const phoneC = document.getElementById("phoneC").value;
    const emailC = document.getElementById("emailC").value;
    const address = document.getElementById("address").value;
    const complaintText = document.getElementById("complaintText").value;
    const imageLink = document.getElementById("imageLink").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    
    if (!fullName || !wilaya || !subscriberNo || !phoneC || !emailC || !address || !complaintText) {
        alert("يرجى ملء جميع الحقول المطلوبة");
        return;
    }
    
    // إضافة الشكوى إلى Firestore
    firebase.firestore().collection('complaints').add({
        userName: fullName,
        userEmail: emailC,
        userPhone: phoneC,
        subscriberNumber: subscriberNo,
        wilaya: wilaya,
        address: address,
        complaintText: complaintText,
        imageUrl: imageLink || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        status: 'submitted',
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        document.getElementById("complaintSuccess").style.display = "block";
        document.getElementById("complaintForm").reset();
        
        // إخفاء رسالة النجاح بعد 3 ثوانٍ
        setTimeout(() => {
            document.getElementById("complaintSuccess").style.display = "none";
        }, 3000);
    })
    .catch((error) => {
        console.error("خطأ في إرسال الشكوى:", error);
        alert("حدث خطأ أثناء إرسال الشكوى. يرجى المحاولة مرة أخرى.");
    });
}