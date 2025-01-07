export interface HanimeResponse {
    layout: string;
    data: any[];
    error: null;
    serverRendered: boolean;
    state: State;
    videos_manifest?: VideosManifest;
    pr?: boolean;
  }
  
  export interface State {
    scrollY: number;
    version: number;
    is_new_version: boolean;
    r: null;
    country_code: null;
    page_name: string;
    user_agent: string;
    ip: null;
    referrer: null;
    geo: null;
    is_dev: boolean;
    is_wasm_supported: boolean;
    is_mounted: boolean;
    is_loading: boolean;
    is_searching: boolean;
    browser_width: number;
    browser_height: number;
    system_msg: string;
    data: Data;
    auth_claim: null;
    session_token: string;
    session_token_expire_time_unix: number;
    env: Env;
    user: null;
    user_setting: null;
    playlists: null;
    shuffle: boolean;
    account_dialog: AccountDialog;
    contact_us_dialog: ContactUsDialog;
    general_confirmation_dialog: GeneralConfirmationDialog;
    snackbar: Snackbar;
    search: Search;
  }
  
  export interface Data {
    video: Video;
  }
  
  export interface Video {
    player_base_url: string;
    hentai_video: HentaiVideo;
    hentai_tags: HentaiTag[];
    hentai_franchise: HentaiFranchise;
    hentai_franchise_hentai_videos: HentaiVideo[];
    hentai_video_storyboards: HentaiVideoStoryboard[];
    brand: Brand;
    watch_later_playlist_hentai_videos: null;
    like_dislike_playlist_hentai_videos: null;
    playlist_hentai_videos: null;
    similar_playlists_data: null;
    next_hentai_video: HentaiVideo;
    next_random_hentai_video: HentaiVideo;
    videos_manifest?: VideosManifest;
    user_license: null;
    bs: Bs;
    ap: number;
    pre: string;
    encrypted_user_license: null;
    host: string;
  }
  
  export interface HentaiVideo {
    id: number;
    is_visible: boolean;
    name: string;
    slug: string;
    created_at: string;
    released_at: string;
    description?: string;
    views: number;
    interests: number;
    poster_url: string;
    cover_url: string;
    is_hard_subtitled: boolean;
    brand: string;
    duration_in_ms: number;
    is_censored: boolean;
    rating: number;
    likes: number;
    dislikes: number;
    downloads: number;
    monthly_rank: number;
    brand_id: string;
    is_banned_in: string;
    preview_url: null;
    primary_color: null;
    created_at_unix: number;
    released_at_unix: number;
    hentai_tags?: HentaiTag[];
    titles?: any[];
  }
  
  export interface HentaiTag {
    id: number;
    text: string;
    count?: number;
    description?: string;
    wide_image_url?: string;
    tall_image_url?: string;
  }
  
  export interface HentaiFranchise {
    id: number;
    name: string;
    slug: string;
    title: string;
  }
  
  export interface HentaiVideoStoryboard {
    id: number;
    num_total_storyboards: number;
    sequence: number;
    url: string;
    frame_width: number;
    frame_height: number;
    num_total_frames: number;
    num_horizontal_frames: number;
    num_vertical_frames: number;
  }
  
  export interface Brand {
    id: number;
    title: string;
    slug: string;
    website_url: null;
    logo_url: null;
    email: null;
    count: number;
  }
  
  export interface VideosManifest {
    servers: Server[];
  }
  
  export interface Server {
    id: number;
    name: string;
    slug: string;
    na_rating: number;
    eu_rating: number;
    asia_rating: number;
    sequence: number;
    is_permanent: boolean;
    streams: Stream[];
  }
  
  export interface Stream {
    id: number;
    server_id: number;
    slug: string;
    kind: string;
    extension: string;
    mime_type: string;
    width: number;
    height: string;
    duration_in_ms: number;
    filesize_mbs: number;
    filename: string;
    url: string;
    is_guest_allowed: boolean;
    is_member_allowed: boolean;
    is_premium_allowed: boolean;
    is_downloadable: boolean;
    compatibility: string;
    hv_id: number;
    server_sequence: number;
    video_stream_group_id: string;
    extra2: null;
  }
  
  export interface Bs {
    ntv_1: Ntv1;
    ntv_2: Ntv2;
    footer_0: Footer0;
    native_1: Native1;
    native_0: Native0;
    ntv_0: Ntv0;
  }
  
  export interface Ntv1 {
    desktop: DesktopAd;
  }
  
  export interface Ntv2 {
    desktop: DesktopAd;
  }
  
  export interface Footer0 {
    mobile: MobileAd;
    desktop: DesktopAd;
  }
  
  export interface Native1 {
    mobile: NativeAd;
  }
  
  export interface Native0 {
    mobile: NativeAd;
  }
  
  export interface Ntv0 {
    desktop: DesktopAd;
  }
  
  export interface DesktopAd {
    id: number;
    ad_id: string;
    ad_type: string;
    placement: string;
    image_url: null;
    iframe_url: string;
    click_url: null | string;
    width: number;
    height: number;
    page: string;
    form_factor: string;
    video_url: null;
    impressions: number;
    clicks: number;
    seconds: number;
    placement_x: null;
  }
  
  export interface MobileAd {
    id: number;
    ad_id: string;
    ad_type: string;
    placement: string;
    image_url: null;
    iframe_url: string;
    click_url: null;
    width: number;
    height: number;
    page: string;
    form_factor: string;
    video_url: null;
    impressions: number;
    clicks: number;
    seconds: number;
    placement_x: null;
  }
  
  export interface NativeAd {
      id: number;
      ad_id: string;
      ad_type: string;
      placement: string;
      image_url: string;
      iframe_url: null;
      click_url: string;
      width: number;
      height: number;
      page: string;
      form_factor: string;
      video_url: null;
      impressions: number;
      clicks: number;
      seconds: number;
      placement_x: string;
  }
  
  export interface Env {
    vhtv_version: number;
    premium_coin_cost: number;
    mobile_apps: MobileApps;
  }
  
  export interface MobileApps {
    code_name: string;
    _build_number: number;
    _semver: string;
    _md5: string;
    _url: string;
  }
  
  export interface AccountDialog {
    is_visible: boolean;
    active_tab_id: string;
    tabs: Tab[];
  }
  
  export interface Tab {
    id: string;
    icon: string;
    title: string;
  }
  
  export interface ContactUsDialog {
    is_visible: boolean;
    is_video_report: boolean;
    subject: string;
    email: string;
    message: string;
    is_sent: boolean;
  }
  
  export interface GeneralConfirmationDialog {
    is_visible: boolean;
    is_persistent: boolean;
    is_mini_close_button_visible: boolean;
    is_cancel_button_visible: boolean;
    cancel_button_text: string;
    title: string;
    body: string;
    confirm_button_text: string;
    confirmation_callback: null;
  }
  
  export interface Snackbar {
    timeout: number;
    context: string;
    mode: string;
    y: string;
    x: string;
    is_visible: boolean;
    text: string;
  }
  
  export interface Search {
    cache_sorting_config: any[];
    cache_tags_filter: null;
    cache_active_brands: null;
    cache_blacklisted_tags_filter: null;
    search_text: string;
    search_response_payload: null;
    total_search_results_count: number;
    order_by: string;
    ordering: string;
    tags_match: string;
    page_size: number;
    offset: number;
    page: number;
    number_of_pages: number;
    tags: any[];
    active_tags_count: number;
    brands: any[];
    active_brands_count: number;
    blacklisted_tags: any[];
    active_blacklisted_tags_count: number;
    is_using_preferences: boolean;
  }

  export interface SearchResult {
    id: number;
    name: string;
    titles: string[];
    slug: string;
    description: string;
    views: number;
    interests: number;
    bannerImage: string;
    coverImage: string;
    brand: {
      name: string;
      id: number;
    };
    durationMs: number;
    isCensored: boolean;
    likes: number;
    rating: number;
    dislikes: number;
    downloads: number;
    rankMonthly: number;
    tags: string[];
    createdAt: number;
    releasedAt: number;
  }
  
  export interface RawSearchResult {
    id: number;
    name: string;
    titles: string[];
    slug: string;
    description: string;
    views: number;
    interests: number;
    poster_url: string;
    cover_url: string;
    brand: string;
    brand_id: number;
    duration_in_ms: number;
    is_censored: boolean;
    likes: number;
    rating: number;
    dislikes: number;
    downloads: number;
    monthly_rank: number;
    tags: string[];
    created_at: number;
    released_at: number;
  }