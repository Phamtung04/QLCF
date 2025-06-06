export type HandleFunction = (i: string, s: string) => Promise<void>;

export type ProfileProgress = {
    label: string;
    variant: string;
    value: number;
};

export type UserProfile = {
    id?: string;
    userMis?: string;
    hdCode?: string;
    email?: string;
    name?: string;
    surname?: string;
    phoneNumber?: string;
    maLevel5?: string;
    maLevel4?: string;
    maLevel3?: string;
    maLevel2?: string;
    tenLevel5?: string;
    tenLevel4?: string;
    tenLevel3?: string;
    tenLevel2?: string;
    chucDanh?: string;
    branchNo?: string;
    btUsers?: string;
    [name: string]: any;
};
export type UserInfo = {
    id: number;
    rid: string;
    name: string;
    userMis: string;
    permission: string;
    lockUp: boolean;
    listBuilding: string;
    listBranchId: string;
};
export type Profile = {
    id: string;
    avatar: string;
    name: string;
    time: string;
};

export type PostImage = {
    img: string;
    featured?: boolean;
    title?: string;
};

export type Likes = {
    like: boolean;
    value: number;
};

export type Group = {
    id: string;
    avatar: string;
    name: string;
};

export type Reply = {
    id: string;
    profile: Profile;
    data: CommentData;
};

export type CommentData = {
    name?: string;
    comment?: string;
    likes?: Likes;
    video?: string;
    replies?: Reply[];
};

export type PostData = {
    id?: string;
    content: string;
    images: PostImage[];
    video?: string;
    likes: Likes;
    comments?: Comment[];
};
export type Comment = {
    id: string;
    profile: Profile;
    data?: CommentData;
};
export type Post = {
    id?: string;
    profile: Profile;
    data: PostData;
};

export type PostDataType = { id: string; data: PostData; profile: Profile };

export interface PostProps {
    commentAdd: (s: string, c: Reply) => Promise<void>;
    handleCommentLikes: HandleFunction;
    editPost?: HandleFunction;
    renderPost?: HandleFunction;
    setPosts?: React.Dispatch<React.SetStateAction<PostDataType[]>>;
    handlePostLikes: (s: string) => Promise<void>;
    handleReplayLikes: (postId: string, commentId: string, replayId: string) => Promise<void>;
    post: PostDataType;
    replyAdd: (postId: string, commentId: string, reply: Reply) => Promise<void>;
}
