export enum EnumYeuCauStatus {
    Nhap = 'Nhap',
    DangXuLy = 'DangXuLy',
    DaPheDuyet = 'DaPheDuyet',
    DaRutLai = 'DaRutLai',
    TraVe = 'TraVe',
    MoLai = 'MoLai',
    TuChoi = 'TuChoi',
    DaChuyenXuLy = 'DaChuyenXuLy',
    DangChoXuLy = 'DangChoXuLy',
    DaDong = 'DaDong',
    ChoDong = 'ChoDong',
    TatCa = '',
    HoanTat = 'HoanTat'
}

export enum EnumYeuCauUuTien {
    Cao = 'Cao',
    Thap = 'Thap',
    TrungBinh = 'TrungBinh',
    TatCa = ''
}

export enum EnumYeuCauGuiEmailNhac {
    KhongGoi = 'KhongGoi',
    Truoc10P = 'Truoc10P',
    Truoc20P = 'Truoc20P',
    Truoc30P = 'Truoc30P'
}

export enum EnumYeuCauMode {
    ChuyenDonViKhacXL = 'ChuyenDonViKhacXL',
    Default = 'Default',
    ChuyenNguoiKhacXL = 'ChuyenNguoiKhacXL'
}

export enum EnumRankKhachHang {
    Diamond = 'Diamond',
    Ruby = 'Ruby',
    Sapphire = 'Sapphire',
    Emerald = 'Emerald'
}

export enum EnumLoaiYeuCau {
    LoaiKhac = 3,
    DangKyTatToanTraiPhieu = 8,
    ThuPhi = 41,
    NopTien = 7,
    RutTien = 6,
    DangKyKhuonMat = 150,
    Payroll = 100,
    CallCenter = 120,
    NangHangKHUT = 90,
    HuyNangHangKHUT = 91,
    ChamSocKHUT = 92,
    MoTaikhoanOnline = 26,
    PheDuyetTatToanTraiPhieu = 9,
    KhachHangUuTien = 90,
    ChuyenTien = 11,
    KieuHoi = 10,
    DanhSachDKTTTPTheoDonVi = 12,
    DangKyLaiSuatTietKiem = 13,
    PheDuyetLaiSuatTietKiem = 14,

    CallCenterTitleList = 121,
    CallCenterList = 20,
    CallCenterReport = 22,
    CallCenterChart = 21,
    LoginVanTay = 23,
    LoginKhuonMat = 24,
    Report = 25,
    MoTaiKhoanAgency = 27,
    TienGui = 15,
    TraiPhieu = 16,
    The = 17,
    Vay = 18,
    DipDacBiet = 19,
    PortalTraining = 31,
    EBanking = 34,
    eRequest = 32,
    OneClickCredit = 40741,
    KhachHangTiemNang = 39
}

export enum EnumLoaiTatToan {
    DungHanMoLai = 'DungHanMoLai',
    TruocHanMoLai = 'TruocHanMoLai',
    DungHanMoLaiSoTienItHon = 'DungHanMoLaiSoTienItHon',
    TruocHanMoLaiSoTienItHon = 'TruocHanMoLaiSoTienItHon',
    DungHanKhongMoLai = 'DungHanKhongMoLai',
    TruocHanKhongMoLai = 'TruocHanKhongMoLai',
    MuaLaiTrongNgaySoTienLonHon = 'MuaLaiTrongNgaySoTienLonHon'
}

export enum EnumCustomSetting {
    lstNhomNguyenNhan = 'lstNhomNguyenNhan',
    settingDangKyTatToanTraiPhieu = 'settingDangKyTatToanTraiPhieu',
    settingDangKyLaiSuatTietKiem = 'settingDangKyLaiSuatTietKiem'
}

export enum EnumKyLanhLai {
    CuoiKy = 'Cuối kỳ',
    HangThang = 'Hàng tháng',
    HangQuy = 'Hàng Quý',
    DauKy = 'Đầu kỳ'
}
export enum EnumNguonTien {
    New = 'Nguồn tiền mới'
}

export enum EnumCallCenterDoiTuong {
    CN = 'CN',
    DN = 'DN',
    TTT = 'TTT',
    KDTT = 'KDTT'
}

export enum EnumTransferTypes {
    trongHeThong = 'INTERNAL',
    ngoaiHeThong = 'EXTERNAL'
}

export enum EnumHinhThucChuyen {
    napas = 'NAPAS',
    citad = 'CITAD'
}

export enum EnumCallCenterUserRole {
    'KSV' = 'KSV',
    'QLCL' = 'QLCL',
    'TTDVKH' = 'TTDVKH',
    'NVXL' = 'NVXL'
}

export enum EnumCallCenterStatus {
    'DRAFT' = 'DRAFT',
    'SEND_BACK' = 'SEND_BACK',
    'IN_PROGRESS_KSV' = 'IN_PROGRESS_KSV',
    'IN_PROGRESS' = 'IN_PROGRESS',
    'APPROVED' = 'APPROVED',
    'CLOSE' = 'CLOSE'
}

export enum EnumMenu {
    Home = 0,
    Order = 1,
    Category = 2,
    Drink = 3,
    Room = 4,
    Building = 5,
    User = 6,
    Statistial = 7
}

export enum EnumOneClickCreditStatus {
    All = 'All',
    New = 'New',
    Waiting = 'Waiting',
    Returned = 'Returned',
    Rejected = 'Rejected',
    Approved = 'Approved',
    SystemApproved = 'SystemApproved'
}

export enum EnumOneClickTTGDStatus {
    TatCa = 'Tất cả',
    ChuaXuLy = 'Chưa xử lý',
    ChoDuyet = 'Chờ duyệt',
    TraLai = 'Trả về',
    DaDuyet = 'Đã duyệt',
    DuyetBoiHeThong = 'Duyệt bởi hệ thống'
}

export enum EnumOneClickTTLeadCode {
    MB01 = 'MB01',
    MB02 = 'MB02',
    MB03 = 'MB03',
    MB04 = 'MB04',
    MB05 = 'MB05',
    MB06 = 'MB06',
    MB07 = 'MB07',
    MB08 = 'MB08'
}

export enum EnumOneClickTTLeadText {
    MB01 = 'KH chưa đăng ký',
    MB02 = 'KH đang đăng ký',
    MB03 = 'KH đã đăng ký thành công',
    MB04 = 'Hồ sơ phê duyệt thành công',
    MB05 = 'Hồ sơ đã bị từ chối',
    MB06 = 'Đang giao thẻ vật lý',
    MB07 = 'Đã giao thẻ vật lý',
    MB08 = 'KH đã kích hoạt thẻ vật lý'
}

export enum EnumOneClickCreditRoles {
    MAKER = '[One Click Credit] - Maker',
    CHECKER = '[One Click Credit] - Checker',
    TTT = '[One Click Credit] - Card Center'
}

export enum EnumOneClickCardInfo {
    VS_CR_CLL_VJ = 'VISA Credit Classic VietJet',
    VS_CR_V_CLL_VJ = 'VISA Virtual Credit Classic VietJet',
    VS_CR_CLL_VJ_LOAN = 'VISA Credit Classic VietJet Loan',
    VS_CR_VJ_PLT = 'VISA Credit VietJet Platinum',
    VS_CR_V_VJ_PLT = 'VISA Virtual Credit VietJet Platinum',
    VS_CR_VJ_PLT_RFM = 'VISA Credit VietJet Platinum RFM',
    VS_CR_VJ_PLT_VAY_CO_TSBD = 'VISA Credit VietJet Platinum-vay co TSBD-HD02',
    VS_CR_GLD_RGL = 'VISA Credit Gold Regular',
    VS_CR_GLD_RFM = 'VISA Credit Gold RFM',
    VS_CR_GLD_VAY_CO_TSBD = 'VISA Credit Gold-vay co TSBD-HD02',
    VS_CR_GLD_LOAN = 'VISA Credit Gold Loan',
    VS_CR_CLL_LOAN = 'VISA Credit Classic Loan',
    VS_CR_CLL_RGL = 'VISA Credit Classic Regular',
    MC_CR_GLD = 'MC Credit Gold',
    MC_CR_GLD_RFM = 'MasterCard Credit Gold RFM',
    MC_CR_GLD_VAY_CO_TSBD = 'MasterCard Credit Gold-vay co TSBD-HD02',
    MC_CR_MULTI_PETRO_M = 'HDBank Petrolimex 4in1',
    MC_CR_MULTI_V_PETRO_M = 'HDBank Petrolimex 4in1',
    MC_DB_MULTI_V_PETRO_M = 'HDBank Petrolimex 4in1',
    MC_DB_MULTI_PETRO_M = 'HDBank Petrolimex 4in1',
    MC_PR_MULTI_V_PETRO_M = 'HDBank Petrolimex 4in1',
    MC_PR_MULTI_PETRO_M = 'HDBank Petrolimex 4in1',
    VS_CR_CLL_VJ_M = 'HDBank Vietjet Classic',
    VS_CR_V_CLL_VJ_M = 'HDBank Vietjet Classic',
    VS_CR_CLL_VJ_LOAN_M = 'HDBank Vietjet Classic',
    VS_CR_VJ_PLT_M = 'HDBank Vietjet Platinum',
    VS_CR_V_VJ_PLT_M = 'HDBank Vietjet Platinum',
    VS_CR_VJ_PLT_RFM_M = 'HDBank Vietjet Platinum',
    VS_CR_VJ_PLT_VAY_CO_TSBD_M = 'HDBank Vietjet Platinum',
    VS_CR_GLD_RGL_M = 'HDBank Visa Gold',
    VS_CR_GLD_RFM_M = 'HDBank Visa Gold',
    VS_CR_GLD_VAY_CO_TSBD_M = 'HDBank Visa Gold',
    VS_CR_GLD_LOAN_M = 'HDBank Visa Gold',
    VS_CR_CLL_LOAN_M = 'HDBank Visa Classic',
    VS_CR_CLL_RGL_M = 'HDBank Visa Classic',
    MC_CR_GLD_M = 'Mastercard Gold',
    MC_CR_GLD_M_HDBank = 'Mastercard Gold',
    MC_CR_GLD_RFM_M = 'HDBank Mastercard Gold',
    MC_CR_GLD_VAY_CO_TSBD_M = 'HDBank Mastercard Gold'
}

// Hợp đồng mới tái tục
export enum EnumHopDongMoiTT {
    HDTT1 = 'HĐ Mới',
    HDTT2 = 'HĐ Tái tục'
}
// Đối tượng bảo hiểm

export enum EnumDoiTuongBh {
    DT1 = 'BH cho TSBĐ',
    DT2 = 'BH cho Người đi vay',
    DT3 = 'BH sức khỏe',
    DT4 = 'BH không bắt buộc'
}

// Loại bảo hiểm
export enum EnumBaohiem {
    BH1 = 'Bảo hiểm nhà tư nhân',

    BH2 = 'Bảo hiểm mọi rủi ro tài sản',

    BH3 = 'Bảo hiểm cháy nổ bắt buộc',

    BH4 = 'Bảo hiểm hỏa hoạn và các rủi ro đặc biệt',

    BH5 = 'Bảo hiểm máy móc thiết bị',

    BH6 = 'Bảo hiểm mọi rủi ro xây dựng',

    BH7 = 'Bảo hiểm mọi rủi ro lắp đặt',

    BH8 = 'Khác'
}

// end

// Đối tác

//
export enum EnumDoiTac {
    DT1 = 'HDI',
    DT2 = 'HDBank',
    DT3 = 'Khác'
}

export enum EnumQuanHeNVVoiCSH {
    QHNV1 = 'Chủ sở hữu',
    QHNV2 = 'Bên thứ ba'
}

export enum EnumlyDoNgoaiLe {
    LDNL1 = 'Nộp phí ngoài tài khoản chuyên thu',
    LDNL2 = 'Ngoài danh mục',
    LDNL3 = '-- Lựa Chọn --',
    LDNL4 = 'Không'
}

export enum EnumBenThuHuong {
    BTH1 = 'HDBank'
}

export enum EnumBenActionLogs {
    action1 = 'LOGIN',
    action2 = 'SEARCH',
    action3 = 'GET_LIST_PROFILE',
    action4 = 'PRINT_PROFILE'
}
