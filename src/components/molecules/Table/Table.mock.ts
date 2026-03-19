import { ColumnDef } from "@tanstack/react-table";

// 1. Fully typed based on your provided JSON
export type ClientProfile = {
    Id: number;
    CurrencyId: string;
    Currencies: string | null;
    FirstName: string;
    LastName: string;
    MiddleName: string | null;
    Login: string;
    RegionId: number;
    Gender: number;
    PersonalId: string | null;
    Address: string;
    Email: string;
    Language: string;
    Phone: string;
    MobilePhone: string;
    BirthDate: string;
    TimeZone: string | null;
    NickName: string | null;
    DocNumber: string | null;
    IBAN: string | null;
    PromoCode: string | null;
    ProfileId: number | null;
    MaximalDailyBet: number | null;
    MaximalSingleBet: number | null;
    CasinoMaximalDailyBet: number | null;
    CasinoMaximalSingleBet: number | null;
    PreMatchSelectionLimit: number;
    LiveSelectionLimit: number;
    Excluded: boolean | null;
    ExcludedLocalDate: string | null;
    IsSubscribedToNewsletter: boolean;
    IsVerified: boolean;
    PartnerName: string;
    PartnerId: number;
    LastLoginIp: string | null;
    RegistrationIp: string | null;
    YesterdayBalance: number | null;
    CreditLimit: number;
    IsUsingCredit: boolean;
    LastLoginTime: string | null;
    LastLoginLocalDate: string | null;
    Balance: number;
    IsLocked: boolean;
    IsCasinoBlocked: boolean;
    IsSportBlocked: boolean;
    IsRMTBlocked: boolean | null;
    Password: string | null;
    PasswordChangeDate: string | null;
    PasswordChangeDateLocal: string | null;
    SportsbookProfileId: number;
    CasinoProfileId: number;
    GlobalLiveDelay: number;
    Created: string;
    CreatedLocalDate: string;
    RFId: string | null;
    ResetExpireDate: string | null;
    ResetExpireDateLocal: string | null;
    DocIssuedBy: string | null;
    LoyaltyLevelId: number;
    IsUsingLoyaltyProgram: boolean;
    LoyaltyPoint: number;
    AffilateId: string | null;
    BTag: string | null;
    TermsAndConditionsVersion: string | null;
    TCVersionAcceptanceDate: string | null;
    TCVersionAcceptanceLocalDate: string | null;
    ExcludedLast: string | null;
    ExcludedLastLocal: string | null;
    UnplayedBalance: number;
    IsTest: boolean;
    ExternalId: string | null;
    AuthomaticWithdrawalAmount: number | null;
    AuthomaticWithdrawalMinLeftAmount: number | null;
    IsAutomaticWithdrawalEnabled: boolean | null;
    SwiftCode: string | null;
    Title: string | null;
    BirthCity: string | null;
    BirthDepartment: string | null;
    BirthRegionId: number | null;
    ZipCode: string;
    BirthRegionCode2: string | null;
    ActivationCode: string | null;
    ActivationCodeExpireDate: string | null;
    ActivationCodeExpireDateLocal: string | null;
    LastSportBetTime: string | null;
    LastSportBetTimeLocal: string | null;
    VerificationDate: string | null;
    VerificationDateLocal: string | null;
    LastCasinoBetTime: string | null;
    LastCasinoBetTimeLocal: string | null;
    FirstDepositTime: string | null;
    FirstDepositDateLocal: string | null;
    LastDepositDateLocal: string | null;
    LastDepositTime: string | null;
    PasswordChangedLastLocal: string | null;
    PasswordChangedLast: string | null;
    ActivationState: string | null;
    ExcludeTypeId: number | null;
    DocIssueDate: string | null;
    DocIssueCode: string | null;
    Province: string | null;
    IsResident: boolean;
    RegistrationSource: string | null;
    IncomeSource: string | null;
    AccountHolder: string | null;
    CashDeskId: number | null;
    ClientCashDeskName: string | null;
    IsSubscribeToEmail: boolean;
    IsSubscribeToSMS: boolean;
    IsSubscribeToBonus: boolean;
    IsSubscribeToInternalMessage: boolean;
    IsSubscribeToPushNotification: boolean;
    IsSubscribeToDirectMail: boolean;
    IsSubscribeToPhoneCall: boolean;
    IsSubscribeToCasinoNewsletter: boolean;
    IsSubscribeToCasinoEmail: boolean;
    IsSubscribeToCasinoSMS: boolean;
    IsSubscribeToCasinoBonus: boolean;
    IsSubscribeToCasinoInternalMessage: boolean;
    IsSubscribeToCasinoPushNotification: boolean;
    IsSubscribeToCasinoPhoneCall: boolean;
    NotificationOptions: number;
    IsLoggedIn: boolean;
    City: string;
    CountryName: string;
    ClientVerificationDate: string | null;
    BankName: string | null;
    Status: number;
    IsNoBonus: boolean;
    IsTwoFactorAuthenticationEnabled: boolean;
    IsQRCodeUsed: boolean | null;
    PartnerClientCategoryId: number;
    WrongLoginBlockLocalTime: string | null;
    WrongLoginAttempts: number;
    LastWrongLoginTimeLocalDate: string | null;
    PepStatusId: number | null;
    DocRegionId: number | null;
    DocRegionName: string | null;
    DocType: string | null;
    DocExpirationDate: string | null;
    AMLRisk: string | null;
    ExclusionReason: string | null;
    Citizenship: string | null;
    IsPhoneVerified: boolean;
    IsMobilePhoneVerified: boolean;
    IsEkengVerified: boolean;
    IsEmailVerified: boolean;
    OwnerId: number | null;
    ChildId: number | null;
    BirthName: string | null;
    StatusActiveDate: string | null;
    StatusActiveDateLocalTime: string | null;
    PartnerFlag: string | null;
    AdditionalAddress: string | null;
    PepStatuses: string | null;
};

// 2. Meaningful columns chosen from the object keys
export const mockColumns: ColumnDef<ClientProfile>[] = [
    { accessorKey: "Id", header: "Id" },
    { accessorKey: "Login", header: "Login" },
    { accessorKey: "FirstName", header: "FirstName" },
    { accessorKey: "LastName", header: "LastName" },
    { accessorKey: "Email", header: "Email" },
    { accessorKey: "CurrencyId", header: "CurrencyId" },
    { accessorKey: "Balance", header: "Balance" },
    { accessorKey: "LoyaltyPoint", header: "LoyaltyPoint" },
    { accessorKey: "IsVerified", header: "IsVerified" },
    { accessorKey: "IsLocked", header: "IsLocked" },
    { accessorKey: "Created", header: "Created" }
];

/* * Pro-Tip: If you literally want ALL 110+ columns rendered,
 * you can auto-generate them dynamically like this instead:
 * * export const mockColumns: ColumnDef<ClientProfile>[] = Object.keys(mockData[0]).map((key) => ({
 * accessorKey: key as keyof ClientProfile,
 * header: key
 * }));
 */

// 3. Mock Data (Your original + 2 generated variants for testing UI states)
export const mockData: ClientProfile[] = [
    {
        // Your Original Data
        Id: 12100972,
        CurrencyId: "EUR",
        Currencies: null,
        FirstName: "Darwin",
        LastName: "Langworth",
        MiddleName: "Aubrey Parisian",
        Login: "Jon99",
        RegionId: 256,
        Gender: 2,
        PersonalId: null,
        Address: "7926 Donny Meadows",
        Email: "****",
        Language: "en",
        Phone: "****",
        MobilePhone: "****",
        BirthDate: "2023-10-24T00:00:00",
        TimeZone: null,
        NickName: null,
        DocNumber: null,
        IBAN: null,
        PromoCode: null,
        ProfileId: null,
        MaximalDailyBet: null,
        MaximalSingleBet: null,
        CasinoMaximalDailyBet: null,
        CasinoMaximalSingleBet: null,
        PreMatchSelectionLimit: 10.0,
        LiveSelectionLimit: 10.0,
        Excluded: null,
        ExcludedLocalDate: null,
        IsSubscribedToNewsletter: false,
        IsVerified: true,
        PartnerName: "Vivaro",
        PartnerId: 1,
        LastLoginIp: null,
        RegistrationIp: null,
        YesterdayBalance: null,
        CreditLimit: 0.0,
        IsUsingCredit: false,
        LastLoginTime: null,
        LastLoginLocalDate: null,
        Balance: 0.0,
        IsLocked: true,
        IsCasinoBlocked: true,
        IsSportBlocked: false,
        IsRMTBlocked: null,
        Password: null,
        PasswordChangeDate: null,
        PasswordChangeDateLocal: null,
        SportsbookProfileId: 25,
        CasinoProfileId: 2,
        GlobalLiveDelay: 6,
        Created: "2026-01-14T10:26:37.343+04:00",
        CreatedLocalDate: "2026-01-14T10:26:37.343",
        RFId: null,
        ResetExpireDate: null,
        ResetExpireDateLocal: null,
        DocIssuedBy: null,
        LoyaltyLevelId: 1,
        IsUsingLoyaltyProgram: true,
        LoyaltyPoint: 0.0,
        AffilateId: null,
        BTag: null,
        TermsAndConditionsVersion: null,
        TCVersionAcceptanceDate: null,
        TCVersionAcceptanceLocalDate: null,
        ExcludedLast: null,
        ExcludedLastLocal: null,
        UnplayedBalance: 0.0,
        IsTest: false,
        ExternalId: null,
        AuthomaticWithdrawalAmount: null,
        AuthomaticWithdrawalMinLeftAmount: null,
        IsAutomaticWithdrawalEnabled: null,
        SwiftCode: null,
        Title: null,
        BirthCity: null,
        BirthDepartment: null,
        BirthRegionId: null,
        ZipCode: "asa",
        BirthRegionCode2: null,
        ActivationCode: null,
        ActivationCodeExpireDate: null,
        ActivationCodeExpireDateLocal: null,
        LastSportBetTime: null,
        LastSportBetTimeLocal: null,
        VerificationDate: "2024-03-07T13:41:23.076+04:00",
        VerificationDateLocal: "2024-03-07T13:41:23.076",
        LastCasinoBetTime: null,
        LastCasinoBetTimeLocal: null,
        FirstDepositTime: null,
        FirstDepositDateLocal: null,
        LastDepositDateLocal: null,
        LastDepositTime: null,
        PasswordChangedLastLocal: null,
        PasswordChangedLast: null,
        ActivationState: null,
        ExcludeTypeId: null,
        DocIssueDate: null,
        DocIssueCode: null,
        Province: null,
        IsResident: true,
        RegistrationSource: null,
        IncomeSource: null,
        AccountHolder: "121",
        CashDeskId: 159,
        ClientCashDeskName: "0",
        IsSubscribeToEmail: true,
        IsSubscribeToSMS: true,
        IsSubscribeToBonus: true,
        IsSubscribeToInternalMessage: true,
        IsSubscribeToPushNotification: true,
        IsSubscribeToDirectMail: true,
        IsSubscribeToPhoneCall: true,
        IsSubscribeToCasinoNewsletter: true,
        IsSubscribeToCasinoEmail: true,
        IsSubscribeToCasinoSMS: true,
        IsSubscribeToCasinoBonus: true,
        IsSubscribeToCasinoInternalMessage: true,
        IsSubscribeToCasinoPushNotification: true,
        IsSubscribeToCasinoPhoneCall: true,
        NotificationOptions: 0,
        IsLoggedIn: false,
        City: "New York",
        CountryName: "America",
        ClientVerificationDate: "2024-03-07T13:41:23.076+04:00",
        BankName: null,
        Status: 1,
        IsNoBonus: false,
        IsTwoFactorAuthenticationEnabled: false,
        IsQRCodeUsed: null,
        PartnerClientCategoryId: 1,
        WrongLoginBlockLocalTime: null,
        WrongLoginAttempts: 0,
        LastWrongLoginTimeLocalDate: null,
        PepStatusId: null,
        DocRegionId: null,
        DocRegionName: null,
        DocType: null,
        DocExpirationDate: null,
        AMLRisk: null,
        ExclusionReason: null,
        Citizenship: null,
        IsPhoneVerified: false,
        IsMobilePhoneVerified: false,
        IsEkengVerified: false,
        IsEmailVerified: false,
        OwnerId: null,
        ChildId: null,
        BirthName: null,
        StatusActiveDate: null,
        StatusActiveDateLocalTime: null,
        PartnerFlag: null,
        AdditionalAddress: null,
        PepStatuses: null
    },
    {
        // Generated: VIP Active User
        ...({} as ClientProfile), // Quick TS trick to avoid re-typing all nulls below
        Id: 12100973,
        CurrencyId: "USD",
        Currencies: "USD,EUR",
        FirstName: "Sarah",
        LastName: "Connor",
        MiddleName: "Jane",
        Login: "SConnor88",
        RegionId: 102,
        Gender: 1,
        PersonalId: "ID-992341",
        Address: "124 Cyberdyne Systems Blvd",
        Email: "sarah.c@example.com",
        Language: "en",
        Phone: "+15551234567",
        MobilePhone: "+15551234567",
        BirthDate: "1985-05-12T00:00:00",
        PreMatchSelectionLimit: 5000.0,
        LiveSelectionLimit: 2000.0,
        IsSubscribedToNewsletter: true,
        IsVerified: true,
        PartnerName: "Vivaro",
        PartnerId: 1,
        CreditLimit: 1000.0,
        IsUsingCredit: true,
        Balance: 14550.75,
        IsLocked: false,
        IsCasinoBlocked: false,
        IsSportBlocked: false,
        SportsbookProfileId: 26,
        CasinoProfileId: 3,
        GlobalLiveDelay: 0,
        Created: "2022-08-11T14:10:00.000+04:00",
        CreatedLocalDate: "2022-08-11T14:10:00.000",
        LoyaltyLevelId: 5,
        IsUsingLoyaltyProgram: true,
        LoyaltyPoint: 4500.5,
        UnplayedBalance: 200.0,
        IsTest: false,
        ZipCode: "90210",
        IsResident: true,
        IsSubscribeToEmail: true,
        IsSubscribeToSMS: false,
        IsSubscribeToBonus: true,
        IsSubscribeToInternalMessage: true,
        IsSubscribeToPushNotification: true,
        IsSubscribeToDirectMail: false,
        IsSubscribeToPhoneCall: false,
        IsSubscribeToCasinoNewsletter: true,
        IsSubscribeToCasinoEmail: true,
        IsSubscribeToCasinoSMS: false,
        IsSubscribeToCasinoBonus: true,
        IsSubscribeToCasinoInternalMessage: true,
        IsSubscribeToCasinoPushNotification: true,
        IsSubscribeToCasinoPhoneCall: false,
        NotificationOptions: 1,
        IsLoggedIn: true,
        City: "Los Angeles",
        CountryName: "America",
        Status: 1,
        IsNoBonus: false,
        IsTwoFactorAuthenticationEnabled: true,
        PartnerClientCategoryId: 2,
        WrongLoginAttempts: 0,
        IsPhoneVerified: true,
        IsMobilePhoneVerified: true,
        IsEkengVerified: false,
        IsEmailVerified: true
    },
    {
        // Generated: Unverified / Blocked User
        ...({} as ClientProfile),
        Id: 12100974,
        CurrencyId: "GBP",
        Currencies: null,
        FirstName: "John",
        LastName: "Doe",
        MiddleName: null,
        Login: "JDoeUnknown",
        RegionId: 44,
        Gender: 1,
        PersonalId: null,
        Address: "Unknown Street 42",
        Email: "j.doe@example.co.uk",
        Language: "en",
        Phone: "",
        MobilePhone: "",
        BirthDate: "1999-01-01T00:00:00",
        PreMatchSelectionLimit: 0.0,
        LiveSelectionLimit: 0.0,
        IsSubscribedToNewsletter: false,
        IsVerified: false,
        PartnerName: "Vivaro",
        PartnerId: 1,
        CreditLimit: 0.0,
        IsUsingCredit: false,
        Balance: 0.0,
        IsLocked: true,
        IsCasinoBlocked: true,
        IsSportBlocked: true,
        SportsbookProfileId: 0,
        CasinoProfileId: 0,
        GlobalLiveDelay: 10,
        Created: "2026-03-10T09:15:00.000+04:00",
        CreatedLocalDate: "2026-03-10T09:15:00.000",
        LoyaltyLevelId: 0,
        IsUsingLoyaltyProgram: false,
        LoyaltyPoint: 0.0,
        UnplayedBalance: 0.0,
        IsTest: false,
        ZipCode: "EC1A 1BB",
        IsResident: false,
        IsSubscribeToEmail: false,
        IsSubscribeToSMS: false,
        IsSubscribeToBonus: false,
        IsSubscribeToInternalMessage: false,
        IsSubscribeToPushNotification: false,
        IsSubscribeToDirectMail: false,
        IsSubscribeToPhoneCall: false,
        IsSubscribeToCasinoNewsletter: false,
        IsSubscribeToCasinoEmail: false,
        IsSubscribeToCasinoSMS: false,
        IsSubscribeToCasinoBonus: false,
        IsSubscribeToCasinoInternalMessage: false,
        IsSubscribeToCasinoPushNotification: false,
        IsSubscribeToCasinoPhoneCall: false,
        NotificationOptions: 0,
        IsLoggedIn: false,
        City: "London",
        CountryName: "United Kingdom",
        Status: 0,
        IsNoBonus: true,
        IsTwoFactorAuthenticationEnabled: false,
        PartnerClientCategoryId: 3,
        WrongLoginAttempts: 5,
        IsPhoneVerified: false,
        IsMobilePhoneVerified: false,
        IsEkengVerified: false,
        IsEmailVerified: false
    },
    {
        // Generated: Local Active User (Armenia)
        ...({} as ClientProfile),
        Id: 12100975,
        CurrencyId: "AMD",
        Currencies: "AMD,USD,EUR",
        FirstName: "Armen",
        LastName: "Sargsyan",
        MiddleName: null,
        Login: "Armen_Bet99",
        RegionId: 374,
        Gender: 1,
        PersonalId: "AM-884920",
        Address: "Baghramyan Ave 19",
        Email: "armen.s@example.am",
        Language: "hy",
        Phone: "+37491234567",
        MobilePhone: "+37491234567",
        BirthDate: "1992-08-20T00:00:00",
        PreMatchSelectionLimit: 500000.0,
        LiveSelectionLimit: 250000.0,
        IsSubscribedToNewsletter: true,
        IsVerified: true,
        PartnerName: "Vivaro",
        PartnerId: 1,
        CreditLimit: 0.0,
        IsUsingCredit: false,
        Balance: 125000.0,
        IsLocked: false,
        IsCasinoBlocked: false,
        IsSportBlocked: false,
        SportsbookProfileId: 12,
        CasinoProfileId: 14,
        GlobalLiveDelay: 0,
        Created: "2024-11-05T16:30:00.000+04:00",
        CreatedLocalDate: "2024-11-05T16:30:00.000",
        LoyaltyLevelId: 3,
        IsUsingLoyaltyProgram: true,
        LoyaltyPoint: 1540.0,
        UnplayedBalance: 5000.0,
        IsTest: false,
        ZipCode: "0019",
        IsResident: true,
        IsLoggedIn: true,
        City: "Yerevan",
        CountryName: "Armenia",
        Status: 1,
        IsNoBonus: false,
        IsTwoFactorAuthenticationEnabled: true,
        PartnerClientCategoryId: 1,
        WrongLoginAttempts: 0,
        IsPhoneVerified: true,
        IsEmailVerified: true
    },
    {
        // Generated: High Roller / VIP User
        ...({} as ClientProfile),
        Id: 12100976,
        CurrencyId: "EUR",
        Currencies: "EUR",
        FirstName: "Klaus",
        LastName: "Müller",
        MiddleName: "Dieter",
        Login: "KM_HighStakes",
        RegionId: 49,
        Gender: 1,
        PersonalId: "DE-109334",
        Address: "Friedrichstraße 43",
        Email: "klaus.muller@vip-example.de",
        Language: "de",
        Phone: "+491512345678",
        MobilePhone: "+491512345678",
        BirthDate: "1978-03-15T00:00:00",
        PreMatchSelectionLimit: 50000.0,
        LiveSelectionLimit: 25000.0,
        IsSubscribedToNewsletter: true,
        IsVerified: true,
        PartnerName: "Vivaro",
        PartnerId: 1,
        CreditLimit: 10000.0,
        IsUsingCredit: false,
        Balance: 84500.5,
        IsLocked: false,
        IsCasinoBlocked: false,
        IsSportBlocked: false,
        SportsbookProfileId: 8,
        CasinoProfileId: 9,
        GlobalLiveDelay: 0,
        Created: "2020-01-20T10:00:00.000+04:00",
        CreatedLocalDate: "2020-01-20T10:00:00.000",
        LoyaltyLevelId: 10,
        IsUsingLoyaltyProgram: true,
        LoyaltyPoint: 125000.0,
        UnplayedBalance: 0.0,
        IsTest: false,
        ZipCode: "10117",
        IsResident: true,
        IsLoggedIn: false,
        City: "Berlin",
        CountryName: "Germany",
        Status: 1,
        IsNoBonus: false,
        IsTwoFactorAuthenticationEnabled: true,
        PartnerClientCategoryId: 5, // VIP Category
        WrongLoginAttempts: 0,
        IsPhoneVerified: true,
        IsEmailVerified: true
    },
    {
        // Generated: Brand New User (Pending KYC/Verification)
        ...({} as ClientProfile),
        Id: 12100977,
        CurrencyId: "CAD",
        Currencies: "CAD",
        FirstName: "Olivia",
        LastName: "Tremblay",
        MiddleName: null,
        Login: "Livvy2026",
        RegionId: 124,
        Gender: 2,
        PersonalId: null,
        Address: "150 Elgin St",
        Email: "olivia.t@example.ca",
        Language: "en",
        Phone: "",
        MobilePhone: "",
        BirthDate: "2001-12-05T00:00:00",
        PreMatchSelectionLimit: 100.0,
        LiveSelectionLimit: 50.0,
        IsSubscribedToNewsletter: false,
        IsVerified: false, // Not verified yet
        PartnerName: "Vivaro",
        PartnerId: 1,
        CreditLimit: 0.0,
        IsUsingCredit: false,
        Balance: 0.0, // Hasn't deposited yet
        IsLocked: false,
        IsCasinoBlocked: false,
        IsSportBlocked: false,
        SportsbookProfileId: 0,
        CasinoProfileId: 0,
        GlobalLiveDelay: 5,
        Created: "2026-03-19T10:15:00.000+04:00",
        CreatedLocalDate: "2026-03-19T10:15:00.000",
        LoyaltyLevelId: 1,
        IsUsingLoyaltyProgram: false,
        LoyaltyPoint: 0.0,
        UnplayedBalance: 0.0,
        IsTest: false,
        ZipCode: "K2P 1L4",
        IsResident: true,
        IsLoggedIn: true,
        City: "Ottawa",
        CountryName: "Canada",
        Status: 1,
        IsNoBonus: false,
        IsTwoFactorAuthenticationEnabled: false,
        PartnerClientCategoryId: 1,
        WrongLoginAttempts: 0,
        IsPhoneVerified: false,
        IsEmailVerified: true
    },
    {
        // Generated: Suspended/Fraud Account
        ...({} as ClientProfile),
        Id: 12100978,
        CurrencyId: "BRL",
        Currencies: "BRL",
        FirstName: "Mateus",
        LastName: "Silva",
        MiddleName: null,
        Login: "MatSilva_Win",
        RegionId: 55,
        Gender: 1,
        PersonalId: "CPF-00000000000",
        Address: "Av. Paulista, 1000",
        Email: "mateus.silva.blocked@example.br",
        Language: "pt",
        Phone: "+5511999999999",
        MobilePhone: "+5511999999999",
        BirthDate: "1995-07-22T00:00:00",
        PreMatchSelectionLimit: 0.0,
        LiveSelectionLimit: 0.0,
        IsSubscribedToNewsletter: false,
        IsVerified: true,
        PartnerName: "Vivaro",
        PartnerId: 1,
        CreditLimit: 0.0,
        IsUsingCredit: false,
        Balance: 150.25,
        IsLocked: true, // Account is Locked
        IsCasinoBlocked: true,
        IsSportBlocked: true,
        SportsbookProfileId: 0,
        CasinoProfileId: 0,
        GlobalLiveDelay: 10,
        Created: "2025-06-11T08:22:00.000+04:00",
        CreatedLocalDate: "2025-06-11T08:22:00.000",
        LoyaltyLevelId: 1,
        IsUsingLoyaltyProgram: false,
        LoyaltyPoint: 12.0,
        UnplayedBalance: 150.25,
        IsTest: false,
        ZipCode: "01310-100",
        IsResident: true,
        IsLoggedIn: false,
        City: "São Paulo",
        CountryName: "Brazil",
        Status: 3, // Assuming 3 = Suspended
        IsNoBonus: true,
        IsTwoFactorAuthenticationEnabled: false,
        PartnerClientCategoryId: 4, // Suspicious Category
        WrongLoginAttempts: 8, // Locked out due to password attempts
        IsPhoneVerified: false,
        IsEmailVerified: true
    },
    {
        // Generated: Casual Regular User
        ...({} as ClientProfile),
        Id: 12100979,
        CurrencyId: "AUD",
        Currencies: "AUD",
        FirstName: "Chloe",
        LastName: "Kelly",
        MiddleName: "Grace",
        Login: "ChloeK88",
        RegionId: 61,
        Gender: 2,
        PersonalId: null,
        Address: "42 Wallaby Way",
        Email: "chloe.g.kelly@example.com.au",
        Language: "en",
        Phone: "+61411000000",
        MobilePhone: "+61411000000",
        BirthDate: "1990-11-30T00:00:00",
        PreMatchSelectionLimit: 500.0,
        LiveSelectionLimit: 200.0,
        IsSubscribedToNewsletter: true,
        IsVerified: true,
        PartnerName: "Vivaro",
        PartnerId: 1,
        CreditLimit: 0.0,
        IsUsingCredit: false,
        Balance: 340.5,
        IsLocked: false,
        IsCasinoBlocked: false,
        IsSportBlocked: false,
        SportsbookProfileId: 11,
        CasinoProfileId: 12,
        GlobalLiveDelay: 3,
        Created: "2023-09-14T20:45:00.000+04:00",
        CreatedLocalDate: "2023-09-14T20:45:00.000",
        LoyaltyLevelId: 2,
        IsUsingLoyaltyProgram: true,
        LoyaltyPoint: 320.75,
        UnplayedBalance: 0.0,
        IsTest: false,
        ZipCode: "2000",
        IsResident: true,
        IsLoggedIn: false,
        City: "Sydney",
        CountryName: "Australia",
        Status: 1,
        IsNoBonus: false,
        IsTwoFactorAuthenticationEnabled: false,
        PartnerClientCategoryId: 1,
        WrongLoginAttempts: 0,
        IsPhoneVerified: true,
        IsEmailVerified: true
    }
];
