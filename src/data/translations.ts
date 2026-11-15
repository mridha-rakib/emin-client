export type Language = "EN" | "DE";

export interface TranslationSchema {
  common: {
    back: string;
    cancel: string;
    save: string;
    confirm: string;
    submit: string;
    loading: string;
    edit: string;
    delete: string;
    viewAll: string;
    search: string;
    filter: string;
    clearAll: string;
    all: string;
    status: string;
    actions: string;
    close: string;
    success: string;
    error: string;
    learnMore: string;
  };
  nav: {
    home: string;
    services: string;
    about: string;
    subscription: string;
    feed: string;
    searchPlaceholder: string;
    login: string;
    signUp: string;
    postRequirements: string;
    myProfile: string;
    messages: string;
    myBookings: string;
    bookingRequests: string;
    manageServices: string;
    settings: string;
    logout: string;
    language: string;
    marketplace: string;
    sellerPortal: string;
    sellProduct: string;
    sellerDashboard: string;
    uploadProduct: string;
    activeMode: string;
    switchToSeller: string;
    switchToCustomer: string;
    switchToProvider: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titlePart2: string;
    subtitlePart1: string;
    subtitlePart2: string;
    searchPlaceholder: string;
    searchButton: string;
    happyUsers: string;
    averageRating: string;
  };
  categories: {
    badge: string;
    title: string;
    subtitle: string;
    professionals: string;
  };
  howItWorks: {
    badge: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  exploreServices: {
    title: string;
    subtitle: string;
    viewAll: string;
    prosAvailable: string;
    prosActive: string;
    activeProviders: string;
    bookNow: string;
  };
  cta: {
    badge: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    getStarted: string;
    learnHow: string;
    feature1: string;
    feature2: string;
    feature3: string;
  };
  auth: {
    welcomeBack: string;
    createAccount: string;
    selectRole: string;
    forgotPasswordTitle: string;
    forgotPasswordSubtitle: string;
    resetPasswordTitle: string;
    resetPasswordSubtitle: string;
    fullNamePlaceholder: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    newPasswordPlaceholder: string;
    forgotPasswordLink: string;
    loginButton: string;
    signUpButton: string;
    sendOtpButton: string;
    updatePasswordButton: string;
    noAccount: string;
    haveAccount: string;
    termsAgreement: string;
    termsLink: string;
    privacyLink: string;
    and: string;
    roleCustomer: string;
    roleProvider: string;
    roleSeller: string;
    signUpWithEmail: string;
    backToLogin: string;
    checkEmail: string;
    checkEmailDesc: string;
    retryEmail: string;
    passwordUpdated: string;
    passwordUpdatedDesc: string;
  };
  servicesPage: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    searchPlaceholder: string;
    findButton: string;
    filters: string;
    clearAll: string;
    categoriesTitle: string;
    sortTitle: string;
    noServicesFound: string;
    noServicesDesc: string;
    expertsAvailable: string;
  };
  feedPage: {
    title: string;
    subtitle: string;
    postPlaceholder: string;
    photoButton: string;
    postButton: string;
    like: string;
    comment: string;
    share: string;
    commentsCount: string;
    likesCount: string;
  };
  postPage: {
    title: string;
    subtitle: string;
    categoryLabel: string;
    selectCategory: string;
    titleLabel: string;
    titlePlaceholder: string;
    budgetLabel: string;
    budgetPlaceholder: string;
    locationLabel: string;
    locationPlaceholder: string;
    urgencyLabel: string;
    urgencyLow: string;
    urgencyMedium: string;
    urgencyHigh: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    submitButton: string;
    postingSuccess: string;
  };
  subscriptionPage: {
    title: string;
    subtitle: string;
    monthly: string;
    yearly: string;
    savePercent: string;
    popularBadge: string;
    choosePlan: string;
    currentPlan: string;
    basicPlan: string;
    proPlan: string;
    enterprisePlan: string;
    featureIncluded: string;
    plans: {
      basic: {
        description: string;
        features: string[];
        notIncluded: string[];
      };
      pro: {
        description: string;
        features: string[];
        notIncluded: string[];
      };
      enterprise: {
        description: string;
        features: string[];
        notIncluded: string[];
      };
    };
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
  messagesPage: {
    title: string;
    searchConversations: string;
    typeMessage: string;
    online: string;
    offline: string;
    send: string;
    noConversationSelected: string;
    selectToChat: string;
    voiceCall: string;
    videoCall: string;
    calling: string;
    incomingCall: string;
    accept: string;
    decline: string;
    endCall: string;
    mute: string;
    unmute: string;
    callFailed: string;
    sendFailed: string;
  };
  customerProfile: {
    title: string;
    editProfile: string;
    email: string;
    phone: string;
    address: string;
    memberSince: string;
    totalBookings: string;
    activeBookings: string;
    recentActivity: string;
  };
  providerProfile: {
    title: string;
    editProfile: string;
    rating: string;
    jobsCompleted: string;
    hourlyRate: string;
    skills: string;
    reviews: string;
    aboutProvider: string;
  };
  bookings: {
    title: string;
    customerSubtitle: string;
    providerSubtitle: string;
    allTab: string;
    pendingTab: string;
    confirmedTab: string;
    completedTab: string;
    cancelledTab: string;
    accept: string;
    reject: string;
    cancelBooking: string;
    viewDetails: string;
    provider: string;
    customer: string;
    date: string;
    amount: string;
    noBookingsFound: string;
  };
  manageServicesPage: {
    title: string;
    subtitle: string;
    addNewService: string;
    serviceName: string;
    price: string;
    status: string;
    active: string;
    inactive: string;
    editService: string;
    deleteService: string;
    photo: string;
    uploadPhoto: string;
    choosePreset: string;
    category: string;
    selectCategory: string;
    duration: string;
    durationPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    pricePerHour: string;
    saveService: string;
    totalServices: string;
    searchPlaceholder: string;
    noServicesFound: string;
  };
  bookServiceModal: {
    title: string;
    subtitle: string;
    confirmedTitle: string;
    confirmedDesc: string;
    preferredDate: string;
    timeSlot: string;
    fullName: string;
    fullNamePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    address: string;
    addressPlaceholder: string;
    notes: string;
    notesPlaceholder: string;
    confirmButton: string;
    cancelButton: string;
  };
  settingsPage: {
    title: string;
    subtitle: string;
    personalInfo: string;
    notifications: string;
    security: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    saveChanges: string;
  };
  aboutPage: {
    title: string;
    subtitle: string;
    badge: string;
    heroTitle: string;
    heroSubtitle: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
    valuesTitle: string;
    stat1: string;
    stat2: string;
    stat3: string;
    stat4: string;
  };
  faqPage: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allQuestions: string;
    general: string;
    pricing: string;
    securityTab: string;
    stillHaveQuestions: string;
    contactSupport: string;
    noFaqs: string;
    categories: {
      all: string;
      general: string;
      forPros: string;
      forClients: string;
      billing: string;
    };
    items: Array<{
      category: string;
      question: string;
      answer: string;
    }>;
  };
  helpPage: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    contactUs: string;
    liveChat: string;
    emailSupport: string;
    phoneSupport: string;
    ticketSubmit: string;
    topic1Title: string;
    topic1Desc: string;
    topic2Title: string;
    topic2Desc: string;
    topic3Title: string;
    topic3Desc: string;
    topic4Title: string;
    topic4Desc: string;
    subjectLabel: string;
    messageLabel: string;
    emailLabel: string;
    emailHint: string;
    signedInHint: string;
    send: string;
    sending: string;
    sentToMessages: string;
    sentToEmail: string;
    sendError: string;
    noTopics: string;
    contactDesc: string;
  };
  termsPage: {
    title: string;
    subtitle: string;
    intro: string;
    section1Title: string;
    section1Text: string;
    section2Title: string;
    section2Text: string;
    section3Title: string;
    section3Text: string;
  };
  privacyPage: {
    title: string;
    subtitle: string;
    intro: string;
    section1Title: string;
    section1Text: string;
    section2Title: string;
    section2Text: string;
    section3Title: string;
    section3Text: string;
  };
  cookiesPage: {
    title: string;
    subtitle: string;
    intro: string;
    section1Title: string;
    section1Text: string;
    section2Title: string;
    section2Text: string;
    section3Title: string;
    section3Text: string;
  };
  policies: {
    termsTitle: string;
    privacyTitle: string;
    cookiesTitle: string;
    lastUpdated: string;
    acceptButton: string;
  };
  editProfileModal: {
    title: string;
    fullName: string;
    email: string;
    phone: string;
    bio: string;
    address: string;
    uploadPhoto: string;
    cancel: string;
    save: string;
  };
  footer: {
    description: string;
    company: string;
    support: string;
    services: string;
    aboutUs: string;
    subscription: string;
    feed: string;
    marketplace: string;
    helpCenter: string;
    faqs: string;
    termsOfService: string;
    privacyPolicy: string;
    cookiePolicy: string;
    homeCleaning: string;
    plumbing: string;
    painting: string;
    electrical: string;
    gardening: string;
    newsletterTitle: string;
    newsletterPlaceholder: string;
    newsletterButton: string;
    subscribedSuccess: string;
    subscribedAlready: string;
    newsletterError: string;
    newsletterSendError: string;
    copyright: string;
    terms: string;
    privacy: string;
    cookies: string;
    phone: string;
    email: string;
    callUs: string;
    calling: string;
    emailUs: string;
    joinCommunity: string;
    dataCare: string;
  };
  marketplace: {
    badge: string;
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    sellAnItem: string;
    allCategories: string;
    filtersAndAttributes: string;
    reset: string;
    color: string;
    allColors: string;
    condition: string;
    allConditions: string;
    brandNew: string;
    likeNew: string;
    refurbished: string;
    good: string;
    maxPrice: string;
    inStockOnly: string;
    activeResults: string;
    itemsFound: string;
    sortBy: string;
    priceLowHigh: string;
    priceHighLow: string;
    highestRated: string;
    aiCurated: string;
    chatAndNegotiate: string;
    buyNow: string;
    soldOut: string;
    aiQualityScore: string;
    verifiedSeller: string;
    freeShipping: string;
    noProductsFound: string;
    noProductsDesc: string;
    clearFilters: string;
  };
  seller: {
    backToPortfolio: string;
    verifiedSeller: string;
    uploadTitle: string;
    uploadSubtitle: string;
    uploadBadge: string;
    successTitle: string;
    successDesc: string;
    productPhotos: string;
    liveAiBadge: string;
    aiAnalyzing: string;
    qualityScore: string;
    orPickSample: string;
    customPhotoUrl: string;
    urlPlaceholder: string;
    aiInspectionReport: string;
    detectedCategory: string;
    detectedType: string;
    dominantColor: string;
    lightingQuality: string;
    angleFeedback: string;
    detectedTags: string;
    productDetails: string;
    listingTitle: string;
    listingTitlePlaceholder: string;
    category: string;
    selectCategory: string;
    subcategory: string;
    subcategoryPlaceholder: string;
    condition: string;
    color: string;
    regularPrice: string;
    floorPrice: string;
    floorPriceHint: string;
    inventoryStatus: string;
    available: string;
    sold: string;
    productDescription: string;
    productDescriptionPlaceholder: string;
    chatgptTraining: string;
    chatgptTrainingSubtitle: string;
    allowAiNegotiation: string;
    shippingTerms: string;
    returnPolicy: string;
    customFaq: string;
    publishButton: string;
    portfolioTitle: string;
    portfolioSubtitle: string;
    addNewListing: string;
    totalListings: string;
    activeItems: string;
    soldItems: string;
    portfolioValue: string;
    allListings: string;
    underReview: string;
    autoNegotiatorActive: string;
    autoNegotiatorPaused: string;
    testAiChat: string;
    markAsSold: string;
    markAsAvailable: string;
    viewInMarketplace: string;
    noListingsFound: string;
    noListingsDesc: string;
  };
  productChat: {
    title: string;
    salesAssistantFor: string;
    originalPrice: string;
    yourOffer: string;
    offerPlaceholder: string;
    sendOffer: string;
    makeOfferButton: string;
    typeMessagePlaceholder: string;
    sendMessage: string;
    dealAccepted: string;
    dealAcceptedDesc: string;
    proceedToCheckout: string;
    sellerFloorProtection: string;
    aiPoweredSales: string;
    quickOffers: string;
    rulesNotice: string;
  };
  checkout: {
    title: string;
    escrowBadge: string;
    deliveryAddress: string;
    fullName: string;
    email: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    paymentMethod: string;
    creditCard: string;
    paypal: string;
    freeExpressShipping: string;
    orderSummary: string;
    originalPrice: string;
    aiDiscount: string;
    shipping: string;
    free: string;
    total: string;
    placeOrder: string;
    processing: string;
    orderSuccessTitle: string;
    orderSuccessDesc: string;
    orderNumber: string;
    continueShopping: string;
    encryptedPayment: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  EN: {
    common: {
      back: "Back",
      cancel: "Cancel",
      save: "Save",
      confirm: "Confirm",
      submit: "Submit",
      loading: "Loading...",
      edit: "Edit",
      delete: "Delete",
      viewAll: "View All",
      search: "Search",
      filter: "Filter",
      clearAll: "Clear All",
      all: "All",
      status: "Status",
      actions: "Actions",
      close: "Close",
      success: "Success",
      error: "Error",
      learnMore: "Learn More",
    },
    nav: {
      home: "Home",
      services: "Services",
      about: "About",
      subscription: "Subscription",
      feed: "Feed",
      searchPlaceholder: "Search for services...",
      login: "Log in",
      signUp: "Sign Up",
      postRequirements: "Post Requirement",
      myProfile: "My Profile",
      messages: "Messages",
      myBookings: "My Bookings",
      bookingRequests: "Booking Requests",
      manageServices: "Manage Services",
      settings: "Settings",
      logout: "Log Out",
      language: "Language",
      marketplace: "Marketplace",
      sellerPortal: "Seller Portal",
      sellProduct: "Sell Product",
      sellerDashboard: "Seller Dashboard",
      uploadProduct: "Upload Product (AI)",
      activeMode: "Active Mode",
      switchToSeller: "Switch to Seller Mode",
      switchToCustomer: "Switch to Customer Mode",
      switchToProvider: "Switch to Provider Mode",
    },
    hero: {
      badge: "The Ultimate Service Marketplace",
      titlePart1: "Discover Expert Services",
      titlePart2: "For Every Need",
      subtitlePart1: "Connect with certified and vetted professionals right in your neighborhood.",
      subtitlePart2: "Book with confidence, pay securely, and get jobs done effortlessly.",
      searchPlaceholder: "What service are you looking for?",
      searchButton: "Search",
      happyUsers: "10k+ Happy Users",
      averageRating: "4.9/5 Average Rating",
    },
    categories: {
      badge: "Popular Categories",
      title: "Explore What You Need",
      subtitle: "From emergency plumbing to master painting and renovations, find vetted specialists.",
      professionals: "Professionals Available",
    },
    howItWorks: {
      badge: "Simple 4-Step Process",
      title: "How Odaboo Works",
      subtitle: "Booking a trustworthy service expert has never been this smooth and effortless.",
      step1Title: "1. Search Service",
      step1Desc: "Browse through hundreds of specialized categories or search specifically for what you need.",
      step2Title: "2. Choose a Pro",
      step2Desc: "Compare verified provider profiles, client reviews, ratings, and transparent hourly rates.",
      step3Title: "3. Book & Schedule",
      step3Desc: "Pick your preferred time slot and confirm your booking instantly with transparent terms.",
      step4Title: "4. Relax & Pay Securely",
      step4Desc: "Your expert arrives and completes the job. Pay safely via our protected payment gateway.",
    },
    exploreServices: {
      title: "Featured Services",
      subtitle: "Discover top-rated services with instant availability in your area.",
      viewAll: "View All Services",
      prosAvailable: "Pros Available",
      prosActive: "Active Pros",
      activeProviders: "Active Providers",
      bookNow: "Book Now",
    },
    cta: {
      badge: "Join Odaboo Today",
      titlePart1: "Ready to Transform Your",
      titlePart2: "Service Experience?",
      description: "Join thousands of satisfied clients and skilled service professionals on Odaboo today.",
      getStarted: "Get Started Now",
      learnHow: "Learn How It Works",
      feature1: "Verified Professionals",
      feature2: "Secure Escrow Payments",
      feature3: "24/7 Dedicated Support",
    },
    auth: {
      welcomeBack: "Welcome Back",
      createAccount: "Create Account",
      selectRole: "Choose Your Role",
      forgotPasswordTitle: "Forgot Password",
      forgotPasswordSubtitle: "Enter your registered email to receive recovery instructions.",
      resetPasswordTitle: "Reset Password",
      resetPasswordSubtitle: "Set a strong new password for your Odaboo account.",
      fullNamePlaceholder: "Full Name",
      emailPlaceholder: "Email address",
      passwordPlaceholder: "Password",
      confirmPasswordPlaceholder: "Confirm Password",
      newPasswordPlaceholder: "New Password",
      forgotPasswordLink: "Forgot password?",
      loginButton: "Sign In",
      signUpButton: "Create Account",
      sendOtpButton: "Send OTP Code",
      updatePasswordButton: "Update Password",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      termsAgreement: "By signing up, you agree to our",
      termsLink: "Terms of Service",
      privacyLink: "Privacy Policy",
      and: "and",
      roleCustomer: "I want to hire services & buy products (Customer)",
      roleProvider: "I want to offer services (Provider)",
      roleSeller: "I want to sell products (Marketplace Seller)",
      signUpWithEmail: "Sign up with Email",
      backToLogin: "Back to Login",
      checkEmail: "Check your inbox",
      checkEmailDesc: "We have sent a verification code to your email address.",
      retryEmail: "Didn't receive code? Resend",
      passwordUpdated: "Password Updated Successfully",
      passwordUpdatedDesc: "You can now log in with your newly updated password.",
    },
    servicesPage: {
      badge: "Service Directory",
      title: "Find Top-Rated",
      titleHighlight: "Local Professionals",
      subtitle: "Explore certified experts across multiple domains with guaranteed customer satisfaction.",
      searchPlaceholder: "Search services, skills, or keywords...",
      findButton: "Search",
      filters: "Filters",
      clearAll: "Clear All",
      categoriesTitle: "Categories",
      sortTitle: "Sort By",
      noServicesFound: "No services found matching your criteria.",
      noServicesDesc: "Try adjusting your search terms or filter selection.",
      expertsAvailable: "Experts Available",
    },
    feedPage: {
      title: "Community Feed",
      subtitle: "Connect with local pros, view recent job posts, and stay updated.",
      postPlaceholder: "What service or project are you looking for?",
      photoButton: "Add Photo",
      postButton: "Publish Post",
      like: "Like",
      comment: "Comment",
      share: "Share",
      commentsCount: "Comments",
      likesCount: "Likes",
    },
    postPage: {
      title: "Post a Requirement",
      subtitle: "Describe the service you need and receive proposals from qualified local experts.",
      categoryLabel: "Service Category",
      selectCategory: "Select a Category",
      titleLabel: "Job Title",
      titlePlaceholder: "e.g., Need master painter for interior apartment renovation",
      budgetLabel: "Estimated Budget",
      budgetPlaceholder: "e.g., CHF 150 - CHF 400",
      locationLabel: "Location / Address",
      locationPlaceholder: "e.g., Zurich, Bahnhofstrasse",
      urgencyLabel: "Urgency Level",
      urgencyLow: "Flexible (Within this month)",
      urgencyMedium: "Soon (This week)",
      urgencyHigh: "Urgent (Within 24 hours)",
      descriptionLabel: "Detailed Description",
      descriptionPlaceholder: "Explain what tasks need to be completed, materials required, and specific timings...",
      submitButton: "Publish Requirement",
      postingSuccess: "Your requirement has been posted successfully!",
    },
    subscriptionPage: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the ideal plan to grow your business and reach thousands of potential clients.",
      monthly: "Monthly Billing",
      yearly: "Yearly Billing",
      savePercent: "Save 20%",
      popularBadge: "Most Popular",
      choosePlan: "Get Started",
      currentPlan: "Current Plan",
      basicPlan: "Starter",
      proPlan: "Professional Pro",
      enterprisePlan: "Enterprise Agency",
      featureIncluded: "What's Included",
      plans: {
        basic: {
          description: "Perfect for individuals just getting started.",
          features: ["Create 1 Service Profile", "Basic Search Visibility", "Community Access", "Standard Support"],
          notIncluded: ["Verified Badge", "Featured Placement", "Advanced Analytics"],
        },
        pro: {
          description: "The ideal plan for growing service providers.",
          features: ["Create up to 5 Profiles", "Priority Search Visibility", "Verified 'Pro' Badge", "Featured Placement", "Priority 24/7 Support", "Client Analytics Dashboard"],
          notIncluded: [],
        },
        enterprise: {
          description: "For agencies and large businesses.",
          features: ["Unlimited Profiles", "Top Search Placement", "Dedicated Account Manager", "Custom Branding", "API Access", "Advanced Team Management"],
          notIncluded: [],
        },
      },
      faqs: [
        { question: "Can I change my plan later?", answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings. Prorated charges will apply automatically." },
        { question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and Apple Pay/Google Pay for your convenience." },
        { question: "Is there a long-term contract?", answer: "No, all our plans are month-to-month or year-to-year. You can cancel your subscription at any time without penalty." },
        { question: "How does the 'Verified Badge' work?", answer: "The Verified Badge requires a brief identity and credential check. Once approved, it helps you stand out in search results and builds trust with clients." },
      ],
    },
    messagesPage: {
      title: "Direct Messages",
      searchConversations: "Search conversations...",
      typeMessage: "Type a message...",
      online: "Active Now",
      offline: "Offline",
      send: "Send",
      noConversationSelected: "No conversation selected",
      selectToChat: "Select a chat from the sidebar to begin communicating.",
      voiceCall: "Voice call",
      videoCall: "Video call",
      calling: "Calling",
      incomingCall: "Incoming call",
      accept: "Accept",
      decline: "Decline",
      endCall: "End",
      mute: "Mute",
      unmute: "Unmute",
      callFailed: "The call could not start. Allow microphone access and try again.",
      sendFailed: "The message could not be sent. Try again.",
    },
    customerProfile: {
      title: "Customer Profile",
      editProfile: "Edit Profile",
      email: "Email Address",
      phone: "Phone Number",
      address: "Address",
      memberSince: "Member Since",
      totalBookings: "Total Bookings",
      activeBookings: "Active Bookings",
      recentActivity: "Recent Activity",
    },
    providerProfile: {
      title: "Provider Profile",
      editProfile: "Edit Profile",
      rating: "Rating",
      jobsCompleted: "Jobs Completed",
      hourlyRate: "Hourly Rate",
      skills: "Skills & Specializations",
      reviews: "Client Reviews",
      aboutProvider: "About Me",
    },
    bookings: {
      title: "My Bookings",
      customerSubtitle: "Manage and track your scheduled service appointments.",
      providerSubtitle: "Review incoming client appointments and pending jobs.",
      allTab: "All Bookings",
      pendingTab: "Pending",
      confirmedTab: "Confirmed",
      completedTab: "Completed",
      cancelledTab: "Cancelled",
      accept: "Accept Booking",
      reject: "Decline",
      cancelBooking: "Cancel",
      viewDetails: "View Details",
      provider: "Service Provider",
      customer: "Client",
      date: "Date & Time",
      amount: "Amount",
      noBookingsFound: "No bookings found in this category.",
    },
    manageServicesPage: {
      title: "Manage Services",
      subtitle: "Add, edit, or pause your service offerings on the Odaboo platform.",
      addNewService: "Add New Service",
      serviceName: "Service Title",
      price: "Base Price",
      status: "Status",
      active: "Active",
      inactive: "Paused",
      editService: "Edit",
      deleteService: "Delete",
      photo: "Service Photo",
      uploadPhoto: "Upload From Device",
      choosePreset: "Or Select Preset Image",
      category: "Category",
      selectCategory: "Select Service Category",
      duration: "Estimated Duration",
      durationPlaceholder: "e.g., 1-2 Hours, 2-3 Hours",
      description: "Service Description",
      descriptionPlaceholder: "Detailed scope of work, warranty, and special inclusions...",
      pricePerHour: "Hourly Rate / Price (CHF)",
      saveService: "Save & Publish Service",
      totalServices: "Total Services",
      searchPlaceholder: "Search published services...",
      noServicesFound: "No services found matching your query.",
    },
    bookServiceModal: {
      title: "Book Service",
      subtitle: "Confirm your schedule and service location",
      confirmedTitle: "Booking Confirmed!",
      confirmedDesc: "Your service booking has been requested. The provider will confirm your appointment shortly.",
      preferredDate: "Preferred Date",
      timeSlot: "Time Slot",
      fullName: "Full Name",
      fullNamePlaceholder: "e.g., John Doe",
      phone: "Phone Number",
      phonePlaceholder: "e.g., +41 79 123 45 67",
      address: "Service Address / Location",
      addressPlaceholder: "Street, house/apartment number, city...",
      notes: "Special Instructions (Optional)",
      notesPlaceholder: "Any details, gate codes, or specific requirements...",
      confirmButton: "Confirm Booking",
      cancelButton: "Cancel",
    },
    settingsPage: {
      title: "Account Settings",
      subtitle: "Manage your profile information and security preferences.",
      personalInfo: "Personal Information",
      notifications: "Notification Preferences",
      security: "Security & Password",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      saveChanges: "Save Changes",
    },
    aboutPage: {
      title: "Empowering Professionals, Simplifying Lives",
      subtitle: "Odaboo is the premier marketplace connecting skilled experts with individuals and businesses that need them.",
      badge: "About Odaboo",
      heroTitle: "Empowering Local Communities Through Expert Services",
      heroSubtitle: "We connect everyday households with vetted, trustworthy service professionals seamlessly and safely.",
      missionTitle: "Our Mission",
      missionText: "To democratize access to high-quality professional services by building a platform that prioritizes transparency, reliability, and excellence.",
      visionTitle: "Our Vision",
      visionText: "To become the world's most trusted and widely used service marketplace, where finding the right expert is as simple as a few clicks.",
      valuesTitle: "Core Values",
      stat1: "Verified Providers",
      stat2: "Satisfied Customers",
      stat3: "Services Completed",
      stat4: "Cities Covered",
    },
    faqPage: {
      badge: "Frequently Asked Questions",
      title: "How can we help you?",
      subtitle: "Find answers to common questions about Odaboo, booking services, and professional accounts.",
      searchPlaceholder: "Search for articles...",
      allQuestions: "All Questions",
      general: "General",
      pricing: "Pricing & Payments",
      securityTab: "Safety & Trust",
      stillHaveQuestions: "Still have questions?",
      contactSupport: "Contact our 24/7 support team anytime.",
      noFaqs: "No matching questions found. Try another search term.",
      categories: {
        all: "All",
        general: "General",
        forPros: "For Professionals",
        forClients: "For Clients",
        billing: "Billing",
      },
      items: [
        { category: "General", question: "What is Odaboo?", answer: "Odaboo is a premium service marketplace that connects trusted professionals with clients needing everyday tasks, home improvements, and specialized services." },
        { category: "General", question: "Is Odaboo available in my city?", answer: "We are currently operating in major metropolitan areas and continuously expanding. When you sign up, you can see the availability of services based on your zip code." },
        { category: "For Professionals", question: "How do I become a verified professional?", answer: "To get the 'Verified Badge', you need to create an account, complete your profile, and submit your ID and any relevant licenses/credentials for our team to review. Verification typically takes 24-48 hours." },
        { category: "For Professionals", question: "How much does Odaboo charge professionals?", answer: "You can create a basic profile for free! For enhanced visibility, analytics, and more features, we offer Premium and Enterprise subscription plans starting at CHF 29/month." },
        { category: "For Professionals", question: "How do I get paid?", answer: "Odaboo uses secure, integrated payment processing. Once a job is completed and approved by the client, funds are deposited directly into your linked bank account within 2-3 business days." },
        { category: "For Clients", question: "How do I book a service?", answer: "Simply search for the service you need, browse verified professionals, select a time that works for you, and confirm your booking. You can message the pro directly to discuss specific details." },
        { category: "For Clients", question: "What if I am not satisfied with the service?", answer: "We take quality very seriously. If you have an issue, please contact our support team within 24 hours of service completion. All verified professionals are backed by our satisfaction guarantee." },
        { category: "For Clients", question: "Are the professionals background-checked?", answer: "Yes! Any professional with a 'Verified Badge' has passed our identity verification and background screening process." },
        { category: "Billing", question: "Can I change my subscription plan later?", answer: "Yes, you can upgrade or downgrade your professional plan at any time from your account settings. Prorated charges will apply automatically." },
        { category: "Billing", question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and Apple Pay/Google Pay for your convenience." },
        { category: "Billing", question: "Is there a long-term contract?", answer: "No, all our subscription plans are month-to-month or year-to-year. You can cancel your subscription at any time without penalty." },
      ],
    },
    helpPage: {
      badge: "Help & Support",
      title: "Help Center",
      subtitle: "Find guides, troubleshoot issues, or connect with our support team to get the most out of Odaboo.",
      searchPlaceholder: "Search for answers...",
      contactUs: "Contact Support",
      liveChat: "Live Chat Support",
      emailSupport: "Email Support",
      phoneSupport: "Phone Support",
      ticketSubmit: "Submit Support Ticket",
      topic1Title: "Getting Started",
      topic1Desc: "Learn how to set up your account, verify your identity, and navigate the marketplace.",
      topic2Title: "Account Settings",
      topic2Desc: "Manage your profile details, notifications, password, and security settings.",
      topic3Title: "Billing & Payments",
      topic3Desc: "Understand your subscription, how to add payment methods, and get paid for services.",
      topic4Title: "Troubleshooting",
      topic4Desc: "Fix common technical issues with the mobile app or website.",
      subjectLabel: "Subject",
      messageLabel: "How can we help?",
      emailLabel: "Email address",
      emailHint: "You are not signed in. Add an email and the reply will be sent there.",
      signedInHint: "You are signed in. The reply will appear in your messages, where you can answer in real time.",
      send: "Send message",
      sending: "Sending...",
      sentToMessages: "Message sent. Open Messages to continue the conversation.",
      sentToEmail: "Message sent. The reply will arrive at your email.",
      sendError: "The message could not be sent. Try again.",
      noTopics: "No topics match your search.",
      contactDesc: "Send a message and our support team will reply.",
    },
    termsPage: {
      title: "Terms of Service",
      subtitle: "Please read these terms carefully before using the Odaboo platform. By accessing or using our services, you agree to be bound by these terms.",
      intro: "Last updated: May 2026. These Terms of Service constitute a legally binding agreement made between you and Odaboo concerning your access to and use of our marketplace.",
      section1Title: "1. Acceptance of Terms",
      section1Text: "By creating an account, accessing, or using the Odaboo platform, you agree to comply with all applicable laws and these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using our platform.",
      section2Title: "2. User Responsibilities",
      section2Text: "As a user of the Odaboo platform (whether a Client or a Professional), you are responsible for maintaining account confidentiality and communicating professionally.",
      section3Title: "3. Dispute Resolution",
      section3Text: "Any disputes between Clients and Professionals must first be addressed directly between the parties. Odaboo's support team is available to assist in mediation.",
    },
    privacyPage: {
      title: "Privacy Policy",
      subtitle: "Your privacy is critically important to us. Learn how we collect, use, and protect your personal information on Odaboo.",
      intro: "Last updated: May 2026. This Privacy Policy applies to all users of the Odaboo marketplace.",
      section1Title: "1. Information We Collect",
      section1Text: "We collect personal information, payment information, and platform usage data strictly to deliver quality services.",
      section2Title: "2. How We Use Information",
      section2Text: "Your data is primarily used to match clients with professionals, process transactions securely, and enhance the overall experience.",
      section3Title: "3. Data Security",
      section3Text: "We implement industry-standard encryption protocols in transit and at rest to safeguard your personal credentials and information.",
    },
    cookiesPage: {
      title: "Cookies Policy",
      subtitle: "Understand what cookies are, how we use them on the Odaboo marketplace, and what choices you have regarding your data.",
      intro: "This Cookies Policy explains what cookies are, how we use them on the Odaboo website, and what choices you have.",
      section1Title: "1. What Are Cookies?",
      section1Text: "Cookies are small text files stored on your device that help our website function smoothly and remember your preferences.",
      section2Title: "2. How We Use Cookies",
      section2Text: "We use essential, performance, and functional cookies to ensure secure logins, page rendering speed, and custom settings.",
      section3Title: "3. Your Choices",
      section3Text: "You have full control over cookie permissions through your web browser settings and our cookie preference manager.",
    },
    policies: {
      termsTitle: "Terms of Service",
      privacyTitle: "Privacy Policy",
      cookiesTitle: "Cookie Policy",
      lastUpdated: "Last Updated: May 2026",
      acceptButton: "I Understand & Accept",
    },
    editProfileModal: {
      title: "Edit Profile",
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      bio: "Bio / About",
      address: "Location / Address",
      uploadPhoto: "Upload New Photo",
      cancel: "Cancel",
      save: "Save Changes",
    },
    footer: {
      description: "Connecting you with top-rated local professionals for every service need. Reliable, secure, and seamless.",
      company: "Company",
      support: "Support",
      services: "Services",
      aboutUs: "About Us",
      subscription: "Subscription",
      feed: "Feed",
      marketplace: "Marketplace",
      helpCenter: "Help Center",
      faqs: "FAQs",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
      cookiePolicy: "Cookie Policy",
      homeCleaning: "Home Cleaning",
      plumbing: "Plumbing",
      painting: "Painting & Plastering",
      electrical: "Trades & Crafts",
      gardening: "Gardening",
      newsletterTitle: "Stay updated with our latest offers & services",
      newsletterPlaceholder: "Enter your work email",
      newsletterButton: "Subscribe",
      subscribedSuccess: "Thank you for subscribing!",
      subscribedAlready: "This email is already subscribed.",
      newsletterError: "Enter a valid email address.",
      newsletterSendError: "The confirmation email could not be sent. Please try again.",
      copyright: "All rights reserved.",
      terms: "Terms",
      privacy: "Privacy",
      cookies: "Cookies",
      phone: "+41 44 123 45 67",
      email: "hello@odaboo.com",
      callUs: "Call us directly",
      calling: "Opening your phone…",
      emailUs: "Email support",
      joinCommunity: "Join our community",
      dataCare: "We care about your data. Read our ",
    },
    marketplace: {
      badge: "Verified Marketplace & Escrow",
      heroTitle: "Discover, Make Offers & Buy Securely",
      heroSubtitle: "Quality-inspected listings from verified sellers. Submit direct price offers, agree on terms, and purchase with 100% escrow protection.",
      searchPlaceholder: "Search for iPhone, Sony ANC, Herman Miller, DJI drone, laptops...",
      sellAnItem: "Sell an Item",
      allCategories: "All Categories",
      filtersAndAttributes: "Filters & Attributes",
      reset: "Reset",
      color: "Color",
      allColors: "All Colors",
      condition: "Condition",
      allConditions: "All Conditions",
      brandNew: "Brand New",
      likeNew: "Like New",
      refurbished: "Refurbished",
      good: "Good",
      maxPrice: "Max Price",
      inStockOnly: "In-Stock Only",
      activeResults: "Active Results",
      itemsFound: "items found",
      sortBy: "Sort by",
      priceLowHigh: "Price: Low to High",
      priceHighLow: "Price: High to Low",
      highestRated: "Highest Rated",
      aiCurated: "Verified Deals",
      chatAndNegotiate: "Make an Offer",
      buyNow: "Buy Now",
      soldOut: "Sold Out",
      aiQualityScore: "Condition Status",
      verifiedSeller: "Verified Seller",
      freeShipping: "Free Express Shipping",
      noProductsFound: "No products found",
      noProductsDesc: "Try adjusting your search query, price range, or category filter to discover available listings.",
      clearFilters: "Clear all filters",
    },
    seller: {
      backToPortfolio: "Back to My Portfolio",
      verifiedSeller: "Verified Seller",
      uploadTitle: "Create New Product Listing",
      uploadSubtitle: "Upload high-quality photos, specify condition details, and configure your pricing and minimum acceptable offer threshold.",
      uploadBadge: "Direct Marketplace Listing",
      successTitle: "Product Successfully Published!",
      successDesc: "Your product is now live on the marketplace. Customers can buy directly or submit price offers within your approved threshold.",
      productPhotos: "Product Photos & Gallery",
      liveAiBadge: "Verified HD",
      aiAnalyzing: "Uploading and processing image...",
      qualityScore: "Condition",
      orPickSample: "Or pick a demo sample to inspect:",
      customPhotoUrl: "Custom Photo URL",
      urlPlaceholder: "Paste direct image URL...",
      aiInspectionReport: "Listing Attributes & Specification",
      detectedCategory: "Detected Category",
      detectedType: "Detected Type",
      dominantColor: "Dominant Color",
      lightingQuality: "Photo Lighting",
      angleFeedback: "Photo Framing",
      detectedTags: "Suggested Tags",
      productDetails: "Product Details & Specifications",
      listingTitle: "Product / Listing Title",
      listingTitlePlaceholder: "e.g. iPhone 15 Pro - Space Black - Mint Condition",
      category: "Category",
      selectCategory: "Select Category",
      subcategory: "Subcategory / Type",
      subcategoryPlaceholder: "e.g. Smartphone, Drone, Ergonomic Chair",
      condition: "Condition",
      color: "Primary Color",
      regularPrice: "Listed Price (CHF)",
      floorPrice: "Minimum Acceptable Offer (CHF)",
      floorPriceHint: "System protects your margin and rejects any offer below this floor price.",
      inventoryStatus: "Inventory Status",
      available: "Available for Sale",
      sold: "Mark as Sold",
      productDescription: "Product Description",
      productDescriptionPlaceholder: "Include condition details, included accessories, purchase date, and reason for selling...",
      chatgptTraining: "Direct Offer & Delivery Rules",
      chatgptTrainingSubtitle: "Configure acceptable offer thresholds, delivery terms, and buyer guarantee rules.",
      allowAiNegotiation: "Enable Direct Customer Price Offers",
      shippingTerms: "Shipping & Delivery Terms",
      returnPolicy: "Return Policy & Guarantee",
      customFaq: "Buyer Terms & Delivery Notes",
      publishButton: "Publish Product Listing",
      portfolioTitle: "Seller Portfolio & Active Listings",
      portfolioSubtitle: "Manage inventory, configure offer thresholds and track customer offers.",
      addNewListing: "Sell New Product",
      totalListings: "Total Listings",
      activeItems: "Active Items",
      soldItems: "Sold Items",
      portfolioValue: "Portfolio Value",
      allListings: "All Listings",
      underReview: "Under Review",
      autoNegotiatorActive: "Direct Offers Enabled",
      autoNegotiatorPaused: "Direct Offers Paused",
      testAiChat: "Preview Offer Flow",
      markAsSold: "Mark Sold",
      markAsAvailable: "Reactivate",
      viewInMarketplace: "View in Marketplace",
      noListingsFound: "No listings found in this category.",
      noListingsDesc: "Upload a new product to list your items and begin receiving verified customer offers.",
    },
    productChat: {
      title: "Make an Offer",
      salesAssistantFor: "Direct Seller Inquiries for",
      originalPrice: "Listed Price",
      yourOffer: "Your Price Offer (CHF)",
      offerPlaceholder: "e.g. 750",
      sendOffer: "Submit Offer",
      makeOfferButton: "Make Price Offer",
      typeMessagePlaceholder: "Ask a question about condition, delivery, or submit your price offer...",
      sendMessage: "Send",
      dealAccepted: "Offer Accepted! Deal Finalized",
      dealAcceptedDesc: "The seller accepted your offer. You can now checkout securely.",
      proceedToCheckout: "Proceed to Secure Checkout",
      sellerFloorProtection: "Protected by verified escrow terms",
      aiPoweredSales: "Automated instant acceptance threshold set by seller.",
      quickOffers: "Quick Offers",
      rulesNotice: "Offers are binding once accepted by the seller.",
    },
    checkout: {
      title: "Secure Escrow Checkout",
      escrowBadge: "Odaboo Buyer Protection & Escrow Guarantee",
      deliveryAddress: "Delivery Address",
      fullName: "Full Name",
      email: "Email Address",
      streetAddress: "Street & House Number",
      city: "City",
      postalCode: "Postal Code",
      paymentMethod: "Payment Method",
      creditCard: "Credit / Debit Card",
      paypal: "PayPal Express",
      freeExpressShipping: "Free Express Delivery (1-2 business days)",
      orderSummary: "Order Summary",
      originalPrice: "Original Price",
      aiDiscount: "AI Negotiated Discount",
      shipping: "Shipping",
      free: "Free",
      total: "Total Amount",
      placeOrder: "Complete Secure Payment",
      processing: "Processing Secure Escrow...",
      orderSuccessTitle: "Order Successfully Placed!",
      orderSuccessDesc: "Your payment is held securely in escrow until you inspect and accept the delivered item.",
      orderNumber: "Order Reference",
      continueShopping: "Continue Shopping",
      encryptedPayment: "256-Bit SSL Encrypted Checkout",
    },
  },
  DE: {
    common: {
      back: "Zurück",
      cancel: "Abbrechen",
      save: "Speichern",
      confirm: "Bestätigen",
      submit: "Absenden",
      loading: "Wird geladen...",
      edit: "Bearbeiten",
      delete: "Löschen",
      viewAll: "Alle anzeigen",
      search: "Suchen",
      filter: "Filtern",
      clearAll: "Alles löschen",
      all: "Alle",
      status: "Status",
      actions: "Aktionen",
      close: "Schließen",
      success: "Erfolg",
      error: "Fehler",
      learnMore: "Mehr erfahren",
    },
    nav: {
      home: "Startseite",
      services: "Dienstleistungen",
      about: "Über uns",
      subscription: "Abonnement",
      feed: "Feed",
      searchPlaceholder: "Nach Dienstleistungen suchen...",
      login: "Anmelden",
      signUp: "Registrieren",
      postRequirements: "Anfrage aufgeben",
      myProfile: "Mein Profil",
      messages: "Nachrichten",
      myBookings: "Meine Buchungen",
      bookingRequests: "Buchungsanfragen",
      manageServices: "Dienste verwalten",
      settings: "Einstellungen",
      logout: "Abmelden",
      language: "Sprache",
      marketplace: "Marktplatz",
      sellerPortal: "Verkäufer-Portal",
      sellProduct: "Produkt verkaufen",
      sellerDashboard: "Verkäufer-Dashboard",
      uploadProduct: "Produkt hochladen (KI)",
      activeMode: "Aktiver Modus",
      switchToSeller: "Zum Verkäufer-Modus wechseln",
      switchToCustomer: "Zum Kunden-Modus wechseln",
      switchToProvider: "Zum Dienstleister-Modus wechseln",
    },
    hero: {
      badge: "Der ultimative Marktplatz für Dienstleistungen",
      titlePart1: "Entdecken Sie Experten-Services",
      titlePart2: "Für Jeden Bedarf",
      subtitlePart1: "Finden Sie geprüfte und zertifizierte Fachkräfte direkt in Ihrer Nachbarschaft.",
      subtitlePart2: "Buchen Sie mit Vertrauen, zahlen Sie sicher und erledigen Sie Aufgaben mühelos.",
      searchPlaceholder: "Welche Dienstleistung suchen Sie?",
      searchButton: "Suchen",
      happyUsers: "Über 10.000 zufriedene Nutzer",
      averageRating: "4,9/5 Durchschnittliche Bewertung",
    },
    categories: {
      badge: "Beliebte Kategorien",
      title: "Finden Sie, was Sie brauchen",
      subtitle: "Von Sanitärnotfällen bis hin zu Malerarbeiten und Renovierungen – finden Sie geprüfte Spezialisten.",
      professionals: "Verfügbare Fachkräfte",
    },
    howItWorks: {
      badge: "Einfacher 4-Schritte-Prozess",
      title: "So funktioniert Odaboo",
      subtitle: "Einen vertrauenswürdigen Dienstleister zu buchen war noch nie so einfach und unkompliziert.",
      step1Title: "1. Dienstleistung suchen",
      step1Desc: "Durchsuchen Sie Hunderte von spezialisierten Kategorien oder suchen Sie gezielt nach Ihrem Bedarf.",
      step2Title: "2. Experten auswählen",
      step2Desc: "Vergleichen Sie verifizierte Anbieterprofile, Kundenbewertungen und transparente Stundensätze.",
      step3Title: "3. Buchen & Terminieren",
      step3Desc: "Wählen Sie Ihren Wunschtermin und bestätigen Sie Ihre Buchung sofort zu transparenten Konditionen.",
      step4Title: "4. Entspannen & sicher bezahlen",
      step4Desc: "Ihr Experte erledigt den Auftrag vor Ort. Bezahlen Sie sicher über unser geschütztes Zahlungsgateway.",
    },
    exploreServices: {
      title: "Ausgewählte Dienstleistungen",
      subtitle: "Entdecken Sie erstklassige Services mit sofortiger Verfügbarkeit in Ihrer Region.",
      viewAll: "Alle Dienstleistungen anzeigen",
      prosAvailable: "Experten verfügbar",
      prosActive: "Aktive Profis",
      activeProviders: "Aktive Anbieter",
      bookNow: "Jetzt buchen",
    },
    cta: {
      badge: "Treten Sie Odaboo bei",
      titlePart1: "Bereit, Ihr Service-Erlebnis",
      titlePart2: "Zu Transformieren?",
      description: "Schließen Sie sich noch heute Tausenden zufriedener Kunden und qualifizierter Dienstleister auf Odaboo an.",
      getStarted: "Jetzt loslegen",
      learnHow: "Erfahren Sie, wie es funktioniert",
      feature1: "Geprüfte Fachkräfte",
      feature2: "Sichere Treuhandzahlungen",
      feature3: "Engagierter 24/7 Support",
    },
    auth: {
      welcomeBack: "Willkommen zurück",
      createAccount: "Konto erstellen",
      selectRole: "Wählen Sie Ihre Rolle",
      forgotPasswordTitle: "Passwort vergessen",
      forgotPasswordSubtitle: "Geben Sie Ihre registrierte E-Mail-Adresse ein, um Anweisungen zum Zurücksetzen zu erhalten.",
      resetPasswordTitle: "Passwort zurücksetzen",
      resetPasswordSubtitle: "Legen Sie ein sicheres neues Passwort für Ihr Odaboo-Konto fest.",
      fullNamePlaceholder: "Vollständiger Name",
      emailPlaceholder: "E-Mail-Adresse",
      passwordPlaceholder: "Passwort",
      confirmPasswordPlaceholder: "Passwort bestätigen",
      newPasswordPlaceholder: "Neues Passwort",
      forgotPasswordLink: "Passwort vergessen?",
      loginButton: "Anmelden",
      signUpButton: "Konto erstellen",
      sendOtpButton: "OTP-Code senden",
      updatePasswordButton: "Passwort aktualisieren",
      noAccount: "Noch kein Konto?",
      haveAccount: "Bereits ein Konto vorhanden?",
      termsAgreement: "Mit Ihrer Registrierung stimmen Sie unseren",
      termsLink: "Nutzungsbedingungen",
      privacyLink: "Datenschutzbestimmungen",
      and: "und",
      roleCustomer: "Ich möchte Dienstleistungen & Produkte kaufen (Kunde)",
      roleProvider: "Ich möchte Dienstleistungen anbieten (Dienstleister)",
      roleSeller: "Ich möchte Produkte verkaufen (Verkäufer)",
      signUpWithEmail: "Mit E-Mail registrieren",
      backToLogin: "Zurück zur Anmeldung",
      checkEmail: "Überprüfen Sie Ihren Posteingang",
      checkEmailDesc: "Wir haben einen Bestätigungscode an Ihre E-Mail-Adresse gesendet.",
      retryEmail: "Keinen Code erhalten? Erneut senden",
      passwordUpdated: "Passwort erfolgreich aktualisiert",
      passwordUpdatedDesc: "Sie können sich jetzt mit Ihrem neu festgelegten Passwort anmelden.",
    },
    servicesPage: {
      badge: "Dienstleistungsverzeichnis",
      title: "Finden Sie erstklassige",
      titleHighlight: "Lokale Fachkräfte",
      subtitle: "Entdecken Sie zertifizierte Experten aus verschiedenen Bereichen mit garantierter Kundenzufriedenheit.",
      searchPlaceholder: "Services, Fähigkeiten oder Stichworte suchen...",
      findButton: "Suchen",
      filters: "Filter",
      clearAll: "Alles zurücksetzen",
      categoriesTitle: "Kategorien",
      sortTitle: "Sortieren nach",
      noServicesFound: "Keine Dienstleistungen gefunden, die Ihren Kriterien entsprechen.",
      noServicesDesc: "Versuchen Sie, Ihre Suchbegriffe oder Filtereinstellungen anzupassen.",
      expertsAvailable: "Experten verfügbar",
    },
    feedPage: {
      title: "Community-Feed",
      subtitle: "Vernetzen Sie sich mit lokalen Dienstleistern, sehen Sie aktuelle Aufträge und bleiben Sie informiert.",
      postPlaceholder: "Nach welcher Dienstleistung oder welchem Projekt suchen Sie?",
      photoButton: "Foto hinzufügen",
      postButton: "Beitrag veröffentlichen",
      like: "Gefällt mir",
      comment: "Kommentieren",
      share: "Teilen",
      commentsCount: "Kommentare",
      likesCount: "Gefällt mir",
    },
    postPage: {
      title: "Anfrage aufgeben",
      subtitle: "Beschreiben Sie Ihren Bedarf und erhalten Sie Angebote von qualifizierten Fachkräften.",
      categoryLabel: "Dienstleistungskategorie",
      selectCategory: "Kategorie auswählen",
      titleLabel: "Auftragstitel",
      titlePlaceholder: "z. B. Malermeister für Wohnungsrenovierung gesucht",
      budgetLabel: "Geschätztes Budget",
      budgetPlaceholder: "z. B. 100 CHF - 300 CHF",
      locationLabel: "Standort / Adresse",
      locationPlaceholder: "z. B. Zürich, Bahnhofstrasse",
      urgencyLabel: "Dringlichkeit",
      urgencyLow: "Flexibel (Diesen Monat)",
      urgencyMedium: "Bald (Diese Woche)",
      urgencyHigh: "Dringend (Innerhalb von 24 Stunden)",
      descriptionLabel: "Detaillierte Beschreibung",
      descriptionPlaceholder: "Erklären Sie die anfallenden Aufgaben, benötigte Materialien und bevorzugte Termine...",
      submitButton: "Anfrage veröffentlichen",
      postingSuccess: "Ihre Anfrage wurde erfolgreich veröffentlicht!",
    },
    subscriptionPage: {
      title: "Einfache, transparente Preise",
      subtitle: "Wählen Sie den passenden Tarif, um Ihr Geschäft auszubauen und Tausende von Kunden zu erreichen.",
      monthly: "Monatliche Abrechnung",
      yearly: "Jährliche Abrechnung",
      savePercent: "20% sparen",
      popularBadge: "Am beliebtesten",
      choosePlan: "Jetzt starten",
      currentPlan: "Aktueller Tarif",
      basicPlan: "Starter",
      proPlan: "Professional Pro",
      enterprisePlan: "Enterprise Agentur",
      featureIncluded: "Enthaltene Leistungen",
      plans: {
        basic: {
          description: "Ideal für Einsteiger und selbstständige Dienstleister.",
          features: ["1 Dienstleistungsprofil erstellen", "Standard-Sichtbarkeit in der Suche", "Zugang zur Community", "Standard-Kundenservice"],
          notIncluded: ["Verifiziertes Abzeichen", "Hervorgehobene Platzierung", "Erweiterte Analysen"],
        },
        pro: {
          description: "Der beliebteste Tarif für wachsende Dienstleister.",
          features: ["Bis zu 5 Profile erstellen", "Priorisierte Suchergebnisse", "Verifiziertes 'Pro'-Abzeichen", "Hervorgehobene Platzierung", "24/7 Prioritäts-Support", "Kunden- & Erfolgs-Dashboard"],
          notIncluded: [],
        },
        enterprise: {
          description: "Für Agenturen, Betriebe und größere Unternehmen.",
          features: ["Unbegrenzte Profile", "Höchste Platzierung in der Suche", "Persönlicher Account Manager", "Individuelles Branding", "API-Zugriff", "Erweitertes Team-Management"],
          notIncluded: [],
        },
      },
      faqs: [
        { question: "Kann ich meinen Tarif später ändern?", answer: "Ja, Sie können Ihren Tarif jederzeit in Ihren Kontoeinstellungen hoch- oder herabstufen. Preisunterschiede werden anteilig berechnet." },
        { question: "Welche Zahlungsmethoden werden akzeptiert?", answer: "Wir akzeptieren alle gängigen Kreditkarten, PayPal sowie Apple Pay und Google Pay." },
        { question: "Gibt es langfristige Vertragslaufzeiten?", answer: "Nein, alle Abonnements laufen flexibel von Monat zu Monat oder Jahr zu Jahr. Sie können jederzeit ohne Kündigungsgebühren kündigen." },
        { question: "Wie erhalte ich das 'Verifiziert'-Abzeichen?", answer: "Das Abzeichen erfordert eine kurze Prüfung Ihrer Identität und Qualifikationen. Nach Freigabe stärkt es das Vertrauen der Kunden und hebt Ihr Profil hervor." },
      ],
    },
    messagesPage: {
      title: "Direktnachrichten",
      searchConversations: "Unterhaltungen durchsuchen...",
      typeMessage: "Nachricht eingeben...",
      online: "Jetzt online",
      offline: "Offline",
      send: "Senden",
      noConversationSelected: "Keine Unterhaltung ausgewählt",
      selectToChat: "Wählen Sie einen Chat aus der Seitenleiste, um die Konversation zu beginnen.",
      voiceCall: "Anruf",
      videoCall: "Videoanruf",
      calling: "Anruf läuft",
      incomingCall: "Eingehender Anruf",
      accept: "Annehmen",
      decline: "Ablehnen",
      endCall: "Beenden",
      mute: "Stumm",
      unmute: "Ton an",
      callFailed: "Der Anruf konnte nicht gestartet werden. Erlauben Sie den Mikrofonzugriff und versuchen Sie es erneut.",
      sendFailed: "Die Nachricht konnte nicht gesendet werden. Bitte erneut versuchen.",
    },
    customerProfile: {
      title: "Kundenprofil",
      editProfile: "Profil bearbeiten",
      email: "E-Mail-Adresse",
      phone: "Telefonnummer",
      address: "Adresse",
      memberSince: "Mitglied seit",
      totalBookings: "Gesamte Buchungen",
      activeBookings: "Aktive Buchungen",
      recentActivity: "Letzte Aktivitäten",
    },
    providerProfile: {
      title: "Dienstleister-Profil",
      editProfile: "Profil bearbeiten",
      rating: "Bewertung",
      jobsCompleted: "Erledigte Aufträge",
      hourlyRate: "Stundensatz",
      skills: "Fähigkeiten & Spezialisierungen",
      reviews: "Kundenbewertungen",
      aboutProvider: "Über mich",
    },
    bookings: {
      title: "Meine Buchungen",
      customerSubtitle: "Verwalten und verfolgen Sie Ihre gebuchten Termine.",
      providerSubtitle: "Eingehende Kundenbuchungen und anstehende Aufträge überprüfen.",
      allTab: "Alle Buchungen",
      pendingTab: "Ausstehend",
      confirmedTab: "Bestätigt",
      completedTab: "Abgeschlossen",
      cancelledTab: "Storniert",
      accept: "Buchung annehmen",
      reject: "Ablehnen",
      cancelBooking: "Stornieren",
      viewDetails: "Details anzeigen",
      provider: "Dienstleister",
      customer: "Kunde",
      date: "Datum & Uhrzeit",
      amount: "Betrag",
      noBookingsFound: "Keine Buchungen in dieser Kategorie gefunden.",
    },
    manageServicesPage: {
      title: "Dienstleistungen verwalten",
      subtitle: "Fügen Sie neue Angebote hinzu, bearbeiten oder pausieren Sie bestehende Services.",
      addNewService: "Neuen Service hinzufügen",
      serviceName: "Dienstleistungstitel",
      price: "Grundpreis",
      status: "Status",
      active: "Aktiv",
      inactive: "Pausiert",
      editService: "Bearbeiten",
      deleteService: "Löschen",
      photo: "Servicefoto",
      uploadPhoto: "Vom Gerät hochladen",
      choosePreset: "Oder Standardbild wählen",
      category: "Kategorie",
      selectCategory: "Dienstkategorie auswählen",
      duration: "Geschätzte Dauer",
      durationPlaceholder: "z.B. 1-2 Stunden, 2-3 Stunden",
      description: "Leistungsbeschreibung",
      descriptionPlaceholder: "Detaillierter Leistungsumfang, Garantie und besondere Leistungen...",
      pricePerHour: "Stundensatz / Preis (CHF)",
      saveService: "Dienst speichern & veröffentlichen",
      totalServices: "Dienste gesamt",
      searchPlaceholder: "Veröffentlichte Dienste durchsuchen...",
      noServicesFound: "Keine Dienste gefunden, die Ihrer Suche entsprechen.",
    },
    bookServiceModal: {
      title: "Dienst buchen",
      subtitle: "Bestätigen Sie Ihren Termin und den Einsatzort",
      confirmedTitle: "Buchung bestätigt!",
      confirmedDesc: "Ihre Buchungsanfrage wurde gesendet. Der Dienstleister wird Ihren Termin in Kürze bestätigen.",
      preferredDate: "Wunschdatum",
      timeSlot: "Zeitfenster",
      fullName: "Vollständiger Name",
      fullNamePlaceholder: "z.B. Max Mustermann",
      phone: "Telefonnummer",
      phonePlaceholder: "z.B. +41 79 123 45 67",
      address: "Einsatzort / Adresse",
      addressPlaceholder: "Straße, Hausnummer, PLZ, Stadt...",
      notes: "Besondere Hinweise (Optional)",
      notesPlaceholder: "Details, Zugangscodes oder besondere Anforderungen...",
      confirmButton: "Buchung bestätigen",
      cancelButton: "Abbrechen",
    },
    settingsPage: {
      title: "Kontoeinstellungen",
      subtitle: "Verwalten Sie Ihre Profilinformationen und Sicherheitseinstellungen.",
      personalInfo: "Persönliche Daten",
      notifications: "Benachrichtigungseinstellungen",
      security: "Sicherheit & Passwort",
      changePassword: "Passwort ändern",
      currentPassword: "Aktuelles Passwort",
      newPassword: "Neues Passwort",
      confirmPassword: "Neues Passwort bestätigen",
      saveChanges: "Änderungen speichern",
    },
    aboutPage: {
      title: "Experten stärken, Alltag erleichtern",
      subtitle: "Odaboo ist die führende Plattform, die qualifizierte Fachkräfte mit Kunden und Unternehmen verbindet.",
      badge: "Über Odaboo",
      heroTitle: "Lokale Gemeinschaften durch erstklassige Services stärken",
      heroSubtitle: "Wir verbinden Haushalte nahtlos und sicher mit geprüften, vertrauenswürdigen Dienstleistern.",
      missionTitle: "Unsere Mission",
      missionText: "Den Zugang zu hochwertigen Dienstleistungen zu demokratisieren, indem wir Transparenz, Verlässlichkeit und Qualität in den Mittelpunkt stellen.",
      visionTitle: "Unsere Vision",
      visionText: "Der weltweit vertrauenswürdigste und meistgenutzte Servicemarktplatz zu werden, auf dem das Finden des passenden Experten nur wenige Klicks entfernt ist.",
      valuesTitle: "Grundwerte",
      stat1: "Verifizierte Anbieter",
      stat2: "Zufriedene Kunden",
      stat3: "Abgeschlossene Aufträge",
      stat4: "Abgedeckte Städte",
    },
    faqPage: {
      badge: "Häufig gestellte Fragen",
      title: "Wie können wir Ihnen helfen?",
      subtitle: "Finden Sie Antworten auf häufige Fragen zu Odaboo, Buchungen und Benutzerkonten.",
      searchPlaceholder: "Nach Artikeln suchen...",
      allQuestions: "Alle Fragen",
      general: "Allgemein",
      pricing: "Preise & Zahlungen",
      securityTab: "Sicherheit & Vertrauen",
      stillHaveQuestions: "Haben Sie noch Fragen?",
      contactSupport: "Kontaktieren Sie jederzeit unseren 24/7 Kundenservice.",
      noFaqs: "Keine passenden Fragen gefunden. Versuchen Sie einen anderen Begriff.",
      categories: {
        all: "Alle",
        general: "Allgemein",
        forPros: "Für Dienstleister",
        forClients: "Für Kunden",
        billing: "Abrechnung & Tarife",
      },
      items: [
        { category: "Allgemein", question: "Was ist Odaboo?", answer: "Odaboo ist ein moderner Marktplatz, der geprüfte lokale Dienstleister mit Kunden für Reparaturen, Handwerk, Reinigung und professionelle Services verbindet." },
        { category: "Allgemein", question: "Ist Odaboo in meiner Stadt verfügbar?", answer: "Wir sind derzeit in vielen Ballungsräumen aktiv und expandieren stetig. Bei der Registrierung können Sie anhand Ihrer Postleitzahl verfügbare Dienstleister einsehen." },
        { category: "Für Dienstleister", question: "Wie werde ich ein verifizierter Dienstleister?", answer: "Um das 'Verifiziert'-Abzeichen zu erhalten, erstellen Sie ein Profil und reichen Ihren Personalausweis sowie relevante Qualifikationsnachweise ein. Die Prüfung dauert in der Regel 24 bis 48 Stunden." },
        { category: "Für Dienstleister", question: "Welche Gebühren fallen für Dienstleister an?", answer: "Das Erstellen eines Basisprofils ist kostenlos! Für gesteigerte Sichtbarkeit und erweiterte Werkzeuge bieten wir Pro- und Enterprise-Tarife ab 29 CHF pro Monat an." },
        { category: "Für Dienstleister", question: "Wie erhalte ich meine Auszahlungen?", answer: "Odaboo nutzt sichere treuhänderische Zahlungsabwicklungen. Sobald ein Auftrag erledigt und vom Kunden freigegeben wurde, wird das Geld innerhalb von 2-3 Werktagen auf Ihr Bankkonto überwiesen." },
        { category: "Für Kunden", question: "Wie buche ich einen Dienstleister?", answer: "Suchen Sie nach dem gewünschten Service, vergleichen Sie verifizierte Profile, wählen Sie einen passenden Termin und bestätigen Sie die Buchung. Sie können direkt im Chat Einzelheiten besprechen." },
        { category: "Für Kunden", question: "Was geschieht, wenn ich mit dem Service nicht zufrieden bin?", answer: "Kundenzufriedenheit hat bei uns oberste Priorität. Sollte es Probleme geben, wenden Sie sich bitte innerhalb von 24 Stunden an unseren Support. Wir vermitteln sofort eine Lösung." },
        { category: "Für Kunden", question: "Sind die Dienstleister überprüft?", answer: "Ja! Alle Dienstleister mit einem 'Verifiziert'-Abzeichen haben unsere Identitätsprüfung und Zuverlässigkeitskontrolle erfolgreich durchlaufen." },
        { category: "Abrechnung & Tarife", question: "Kann ich mein Abonnement jederzeit ändern?", answer: "Ja, Sie können Ihren Tarif in den Kontoeinstellungen jederzeit anpassen oder kündigen. Abrechnungsdifferenzen werden automatisch tagesgenau verrechnet." },
        { category: "Abrechnung & Tarife", question: "Welche Zahlungsmethoden stehen zur Verfügung?", answer: "Wir unterstützen Kredit- und Debitkarten, PayPal, Apple Pay, Google Pay sowie Sofortüberweisung." },
        { category: "Abrechnung & Tarife", question: "Gibt es feste Vertragslaufzeiten?", answer: "Nein, alle unsere Tarife sind monatlich oder jährlich kündbar. Es entstehen keine versteckten Kündigungsgebühren." },
      ],
    },
    helpPage: {
      badge: "Hilfe & Support",
      title: "Hilfecenter",
      subtitle: "Leitfäden, Problemlösungen und direkter Kontakt zu unserem Support-Team.",
      searchPlaceholder: "Nach Antworten suchen...",
      contactUs: "Kundendienst kontaktieren",
      liveChat: "Live-Chat Support",
      emailSupport: "E-Mail Support",
      phoneSupport: "Telefonischer Support",
      ticketSubmit: "Support-Ticket einreichen",
      topic1Title: "Erste Schritte",
      topic1Desc: "Erfahren Sie, wie Sie Ihr Konto einrichten, Ihre Identität bestätigen und die Plattform nutzen.",
      topic2Title: "Kontoeinstellungen",
      topic2Desc: "Verwalten Sie Ihre Profildaten, Benachrichtigungen, Passwörter und Sicherheitseinstellungen.",
      topic3Title: "Abrechnung & Zahlungen",
      topic3Desc: "Informationen zu Abonnements, Zahlungsmethoden und Auszahlungen für Dienstleister.",
      topic4Title: "Fehlerbehebung",
      topic4Desc: "Lösungen für häufige technische Probleme mit der Website oder mobilen Ansicht.",
      subjectLabel: "Betreff",
      messageLabel: "Wie können wir helfen?",
      emailLabel: "E-Mail-Adresse",
      emailHint: "Sie sind nicht angemeldet. Geben Sie eine E-Mail an, damit die Antwort dorthin gesendet wird.",
      signedInHint: "Sie sind angemeldet. Die Antwort erscheint in Ihren Nachrichten, und Sie können direkt antworten.",
      send: "Nachricht senden",
      sending: "Wird gesendet...",
      sentToMessages: "Nachricht gesendet. Öffnen Sie Nachrichten, um das Gespräch fortzusetzen.",
      sentToEmail: "Nachricht gesendet. Die Antwort kommt per E-Mail.",
      sendError: "Die Nachricht konnte nicht gesendet werden. Bitte erneut versuchen.",
      noTopics: "Keine Themen passen zur Suche.",
      contactDesc: "Senden Sie eine Nachricht, unser Support antwortet Ihnen.",
    },
    termsPage: {
      title: "Nutzungsbedingungen",
      subtitle: "Bitte lesen Sie diese Bedingungen sorgfältig durch, bevor Sie Odaboo nutzen. Durch die Nutzung erklären Sie sich damit einverstanden.",
      intro: "Zuletzt aktualisiert: Mai 2026. Diese Nutzungsbedingungen stellen eine rechtsverbindliche Vereinbarung zwischen Ihnen und Odaboo dar.",
      section1Title: "1. Annahme der Bedingungen",
      section1Text: "Mit der Erstellung eines Kontos und der Nutzung von Odaboo erklären Sie sich mit allen geltenden Gesetzen und diesen Bedingungen einverstanden.",
      section2Title: "2. Pflichten der Nutzer",
      section2Text: "Als Nutzer der Plattform (Kunde oder Dienstleister) sind Sie für die Vertraulichkeit Ihres Kontos und professionelle Kommunikation verantwortlich.",
      section3Title: "3. Streitbeilegung",
      section3Text: "Streitigkeiten zwischen Kunden und Dienstleistern sollten zunächst direkt geklärt werden. Das Odaboo-Supportteam steht vermittelnd zur Seite.",
    },
    privacyPage: {
      title: "Datenschutzerklärung",
      subtitle: "Der Schutz Ihrer Privatsphäre ist uns wichtig. Erfahren Sie, wie wir Ihre Daten erfassen, nutzen und schützen.",
      intro: "Zuletzt aktualisiert: Mai 2026. Diese Datenschutzerklärung gilt für alle Nutzer des Odaboo-Marktplatzes.",
      section1Title: "1. Erfasste Informationen",
      section1Text: "Wir erfassen personenbezogene Daten, Zahlungsinformationen und Nutzungsdaten ausschließlich zur Erbringung unserer Dienste.",
      section2Title: "2. Verwendung der Daten",
      section2Text: "Ihre Daten werden primär verwendet, um Kunden mit passenden Fachkräften zu verbinden und Zahlungen sicher abzuwickeln.",
      section3Title: "3. Datensicherheit",
      section3Text: "Wir verwenden moderne Verschlüsselungsstandards bei der Übertragung und Speicherung, um Ihre Daten bestmöglich zu schützen.",
    },
    cookiesPage: {
      title: "Cookie-Richtlinie",
      subtitle: "Erfahren Sie, was Cookies sind, wie wir sie auf Odaboo einsetzen und welche Einstellungsmöglichkeiten Sie haben.",
      intro: "Diese Cookie-Richtlinie erklärt den Einsatz von Cookies auf unserer Website und Ihre Auswahlmöglichkeiten.",
      section1Title: "1. Was sind Cookies?",
      section1Text: "Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, damit unsere Website reibungslos funktioniert und Ihre Einstellungen speichert.",
      section2Title: "2. Wie wir Cookies verwenden",
      section2Text: "Wir nutzen notwendige, analytische und funktionale Cookies für sichere Anmeldungen, schnelle Ladezeiten und individuelle Einstellungen.",
      section3Title: "3. Ihre Wahlmöglichkeiten",
      section3Text: "Sie haben die volle Kontrolle über Cookies über Ihre Browsereinstellungen und unseren Cookie-Präferenz-Manager.",
    },
    policies: {
      termsTitle: "Nutzungsbedingungen",
      privacyTitle: "Datenschutzerklärung",
      cookiesTitle: "Cookie-Richtlinie",
      lastUpdated: "Zuletzt aktualisiert: Mai 2026",
      acceptButton: "Verstanden & Akzeptieren",
    },
    editProfileModal: {
      title: "Profil bearbeiten",
      fullName: "Vollständiger Name",
      email: "E-Mail-Adresse",
      phone: "Telefonnummer",
      bio: "Über mich / Biografie",
      address: "Standort / Adresse",
      uploadPhoto: "Neues Foto hochladen",
      cancel: "Abbrechen",
      save: "Änderungen speichern",
    },
    footer: {
      description: "Wir verbinden Sie mit erstklassigen lokalen Fachkräften für jeden Bedarf. Zuverlässig, sicher und nahtlos.",
      company: "Unternehmen",
      support: "Support",
      services: "Dienstleistungen",
      aboutUs: "Über uns",
      subscription: "Abonnement",
      feed: "Feed",
      marketplace: "Marktplatz",
      helpCenter: "Hilfecenter",
      faqs: "Häufige Fragen",
      termsOfService: "Nutzungsbedingungen",
      privacyPolicy: "Datenschutz",
      cookiePolicy: "Cookie-Richtlinie",
      homeCleaning: "Haushaltsreinigung",
      plumbing: "Sanitär & Klempner",
      painting: "Maler & Gipser",
      electrical: "Handwerk & Gewerbe",
      gardening: "Gartenpflege",
      newsletterTitle: "Bleiben Sie über unsere neuesten Angebote & Services informiert",
      newsletterPlaceholder: "Geben Sie Ihre geschäftliche E-Mail ein",
      newsletterButton: "Abonnieren",
      subscribedSuccess: "Vielen Dank für Ihre Anmeldung!",
      subscribedAlready: "Diese E-Mail ist bereits abonniert.",
      newsletterError: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      newsletterSendError: "Die Bestätigungs-E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      copyright: "Alle Rechte vorbehalten.",
      terms: "AGB",
      privacy: "Datenschutz",
      cookies: "Cookies",
      phone: "+41 44 123 45 67",
      email: "hello@odaboo.com",
      callUs: "Rufen Sie uns direkt an",
      calling: "Telefon wird geöffnet…",
      emailUs: "Support per E-Mail",
      joinCommunity: "Werden Sie Teil unserer Community",
      dataCare: "Datenschutz ist uns wichtig. Lesen Sie unsere ",
    },
    marketplace: {
      badge: "Verifizierter Marktplatz & Treuhand",
      heroTitle: "Entdecken, Angebote machen & Sicher kaufen",
      heroSubtitle: "Geprüfte Angebote von verifizierten Verkäufern. Geben Sie direkte Preisangebote ab, vereinbaren Sie Konditionen und kaufen Sie mit 100% Treuhandschutz.",
      searchPlaceholder: "Suchen nach Smartphones, Kopfhörern, Ergonomie, Drohnen, Laptops...",
      sellAnItem: "Als Verkäufer einstellen",
      allCategories: "Alle Kategorien",
      filtersAndAttributes: "Filter & Merkmale",
      reset: "Zurücksetzen",
      color: "Farbe",
      allColors: "Alle Farben",
      condition: "Zustand",
      allConditions: "Alle Zustände",
      brandNew: "Fabrikneu",
      likeNew: "Wie neu",
      refurbished: "Generalüberholt",
      good: "Guter Zustand",
      maxPrice: "Max. Preis",
      inStockOnly: "Nur verfügbare Artikel",
      activeResults: "Aktive Angebote",
      itemsFound: "Artikel gefunden",
      sortBy: "Sortieren nach",
      priceLowHigh: "Preis: aufsteigend",
      priceHighLow: "Preis: absteigend",
      highestRated: "Bestbewertet",
      aiCurated: "Geprüfte Deals",
      chatAndNegotiate: "Angebot machen",
      buyNow: "Jetzt Kaufen",
      soldOut: "Ausverkauft",
      aiQualityScore: "Zustand & Prüfung",
      verifiedSeller: "Verifizierter Verkäufer",
      freeShipping: "Kostenloser Expressversand",
      noProductsFound: "Keine Produkte gefunden",
      noProductsDesc: "Passen Sie Ihre Suchbegriffe, Preisspannen oder Filter an, um verfügbare Angebote zu entdecken.",
      clearFilters: "Filter zurücksetzen",
    },
    seller: {
      backToPortfolio: "Zurück zu meinen Produkten",
      verifiedSeller: "Verifizierter Verkäufer",
      uploadTitle: "Neues Produkt einstellen",
      uploadSubtitle: "Laden Sie hochauflösende Fotos hoch, geben Sie Zustandsdetails an und legen Sie Ihren Mindestpreis für Preisangebote fest.",
      uploadBadge: "Direktes Marktplatz-Angebot",
      successTitle: "Produkt erfolgreich veröffentlicht!",
      successDesc: "Ihr Produkt ist jetzt auf dem Marktplatz live. Käufer können direkt kaufen oder Preisangebote innerhalb Ihrer Freigabegrenze abgeben.",
      productPhotos: "Produktfotos & Galerie",
      liveAiBadge: "Geprüftes HD",
      aiAnalyzing: "Foto wird hochgeladen und verarbeitet...",
      qualityScore: "Zustand",
      orPickSample: "Oder wählen Sie ein Demo-Beispiel:",
      customPhotoUrl: "Eigene Foto-URL",
      urlPlaceholder: "Direkte Bild-URL einfügen...",
      aiInspectionReport: "Artikelmerkmale & Spezifikationen",
      detectedCategory: "Erkannte Kategorie",
      detectedType: "Erkannter Typ",
      dominantColor: "Hauptfarbe",
      lightingQuality: "Beleuchtung",
      angleFeedback: "Bildausschnitt",
      detectedTags: "Vorgeschlagene Tags",
      productDetails: "Produktdetails & Spezifikationen",
      listingTitle: "Produkttitel / Überschrift",
      listingTitlePlaceholder: "z.B. iPhone 15 Pro - Space Schwarz - Exzellenter Zustand",
      category: "Kategorie",
      selectCategory: "Kategorie auswählen",
      subcategory: "Unterkategorie / Typ",
      subcategoryPlaceholder: "z.B. Smartphone, Drohne, Bürostuhl",
      condition: "Zustand",
      color: "Hauptfarbe",
      regularPrice: "Angebotspreis (CHF)",
      floorPrice: "Mindestakzeptables Angebot (CHF)",
      floorPriceHint: "Das System schützt Ihre Marge und lehnt Angebote unter diesem Betrag ab.",
      inventoryStatus: "Lagerbestand-Status",
      available: "Verfügbar zum Verkauf",
      sold: "Als verkauft markieren",
      productDescription: "Produktbeschreibung",
      productDescriptionPlaceholder: "Zustandsdetails, Zubehör, Kaufdatum und Grund des Verkaufs angeben...",
      chatgptTraining: "Angebotskonditionen & Lieferregeln",
      chatgptTrainingSubtitle: "Legen Sie Mindestgrenzen für Preisangebote, Lieferkonditionen und Rückgaberichtlinien fest.",
      allowAiNegotiation: "Direkte Kundenangebote aktivieren",
      shippingTerms: "Versand- & Lieferbedingungen",
      returnPolicy: "Rückgaberichtlinien & Garantie",
      customFaq: "Käuferkonditionen & Lieferhinweise",
      publishButton: "Produkt einstellen",
      portfolioTitle: "Verkäufer-Portfolio & Aktive Angebote",
      portfolioSubtitle: "Verwalten Sie Ihr Sortiment, legen Sie Mindestangebote fest und verfolgen Sie Kundenanfragen.",
      addNewListing: "Neues Produkt einstellen",
      totalListings: "Gesamte Angebote",
      activeItems: "Verfügbare Artikel",
      soldItems: "Verkaufte Artikel",
      portfolioValue: "Sortimentswert",
      allListings: "Alle Angebote",
      underReview: "In Prüfung",
      autoNegotiatorActive: "Direktangebote Aktiv",
      autoNegotiatorPaused: "Direktangebote Pausiert",
      testAiChat: "Angebotsansicht testen",
      markAsSold: "Als verkauft markieren",
      markAsAvailable: "Wieder aktivieren",
      viewInMarketplace: "Auf Marktplatz ansehen",
      noListingsFound: "Keine Angebote in diesem Bereich gefunden.",
      noListingsDesc: "Laden Sie ein neues Produkt hoch, um Angebote zu erhalten und Verkäufe abzuwickeln.",
    },
    productChat: {
      title: "Preisangebot abgeben",
      salesAssistantFor: "Direkte Verkäuferanfrage für",
      originalPrice: "Angebotener Preis",
      yourOffer: "Ihr Preisangebot (CHF)",
      offerPlaceholder: "z.B. 750",
      sendOffer: "Angebot einreichen",
      makeOfferButton: "Preisangebot abgeben",
      typeMessagePlaceholder: "Stellen Sie Fragen zu Zustand, Versand oder bieten Sie einen Preis...",
      sendMessage: "Senden",
      dealAccepted: "Angebot Angenommen! Deal besiegelt",
      dealAcceptedDesc: "Der Verkäufer hat Ihr Angebot angenommen. Sie können jetzt sicher bezahlen.",
      proceedToCheckout: "Zur sicheren Kasse gehen",
      sellerFloorProtection: "Geschützt durch Treuhand-Bedingungen",
      aiPoweredSales: "Automatisches Akzeptieren gemäß Verkäufer-Mindestpreis.",
      quickOffers: "Schnellangebote",
      rulesNotice: "Angebote sind verbindlich, sobald sie bestätigt wurden.",
    },
    checkout: {
      title: "Sichere Treuhand-Kasse",
      escrowBadge: "Odaboo Käuferschutz & Treuhand-Garantie",
      deliveryAddress: "Lieferadresse",
      fullName: "Vollständiger Name",
      email: "E-Mail-Adresse",
      streetAddress: "Straße & Hausnummer",
      city: "Stadt",
      postalCode: "Postleitzahl",
      paymentMethod: "Zahlungsart",
      creditCard: "Kredit- / Debitkarte",
      paypal: "PayPal Express",
      freeExpressShipping: "Kostenlose Expresslieferung (1-2 Werktage)",
      orderSummary: "Bestellübersicht",
      originalPrice: "Regulärer Preis",
      aiDiscount: "KI-Verhandelter Rabatt",
      shipping: "Versand",
      free: "Kostenlos",
      total: "Gesamtbetrag",
      placeOrder: "Zahlung jetzt abschließen",
      processing: "Treuhandzahlung wird verarbeitet...",
      orderSuccessTitle: "Bestellung erfolgreich aufgegeben!",
      orderSuccessDesc: "Ihre Zahlung wird sicher im Treuhandkonto verwahrt, bis Sie den gelieferten Artikel geprüft und freigegeben haben.",
      orderNumber: "Bestellnummer",
      continueShopping: "Weiter einkaufen",
      encryptedPayment: "256-Bit SSL-verschlüsselte Bezahlung",
    },
  },
};
