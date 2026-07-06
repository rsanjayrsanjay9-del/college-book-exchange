import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Timestamp = bigint;
export interface InterestWithDetails {
    id: InterestId;
    bookTitle: string;
    buyerEmail: string;
    createdAt: Timestamp;
    buyerPhone: string;
    bookId: BookId;
    buyerId: UserId;
    buyerName: string;
}
export interface BookInput {
    title: string;
    subject: string;
    photoUrl?: string;
    author: string;
    price: bigint;
}
export interface Notification {
    id: NotificationId;
    bookTitle: string;
    buyerEmail: string;
    createdAt: Timestamp;
    buyerPhone: string;
    bookId: BookId;
    isRead: boolean;
    buyerId: UserId;
    buyerName: string;
    interestId: InterestId;
}
export interface User {
    id: UserId;
    collegeName?: string;
    name: string;
    createdAt: Timestamp;
    email: string;
    isAdmin: boolean;
    phone: string;
}
export type NotificationId = bigint;
export type InterestId = bigint;
export interface Interest {
    id: InterestId;
    createdAt: Timestamp;
    bookId: BookId;
    buyerId: UserId;
}
export interface UserInput {
    collegeName?: string;
    name: string;
    email: string;
    phone: string;
}
export type BookId = bigint;
export interface Book {
    id: BookId;
    status: BookStatus;
    title: string;
    subject: string;
    createdAt: Timestamp;
    photoUrl?: string;
    author: string;
    sellerId: UserId;
    price: bigint;
}
export enum BookStatus {
    sold = "sold",
    available = "available"
}
export interface backendInterface {
    adminConfirmAvailability(id: BookId): Promise<Book | null>;
    adminDeleteBook(id: BookId): Promise<boolean>;
    adminDeleteUser(id: UserId): Promise<boolean>;
    adminGetNewInterestNotifications(): Promise<Array<InterestWithDetails>>;
    adminGetSellerContact(bookId: BookId): Promise<{
        name: string;
        email: string;
        phone: string;
    } | null>;
    adminListAllInterests(): Promise<Array<InterestWithDetails>>;
    adminMarkBookSold(id: BookId): Promise<Book | null>;
    adminUpdateBook(id: BookId, input: BookInput): Promise<Book | null>;
    createBook(input: BookInput): Promise<Book>;
    deleteBook(id: BookId): Promise<boolean>;
    deleteInterest(id: InterestId): Promise<boolean>;
    deleteUser(id: UserId): Promise<boolean>;
    expressInterest(bookId: BookId): Promise<Interest>;
    getAdminNotifications(): Promise<Array<Notification>>;
    getBook(id: BookId): Promise<Book | null>;
    getInterest(id: InterestId): Promise<Interest | null>;
    getInterestsForMyBooks(): Promise<Array<Interest>>;
    getMyBooks(): Promise<Array<Book>>;
    getMyInterests(): Promise<Array<Interest>>;
    getMyProfile(): Promise<User | null>;
    getUnreadAdminNotificationCount(): Promise<bigint>;
    getUser(id: UserId): Promise<User | null>;
    listBooks(): Promise<Array<Book>>;
    listInterests(): Promise<Array<Interest>>;
    listInterestsWithDetails(): Promise<Array<InterestWithDetails>>;
    listUsers(): Promise<Array<User>>;
    markAdminNotificationAsRead(id: NotificationId): Promise<Notification | null>;
    registerUser(input: UserInput): Promise<User>;
    searchBooks(searchTerm: string | null, collegeFilter: string | null): Promise<Array<Book>>;
    setAdmin(id: UserId, admin: boolean): Promise<User | null>;
    updateBook(id: BookId, input: BookInput): Promise<Book | null>;
    updateMyProfile(input: UserInput): Promise<User | null>;
    updateUser(id: UserId, input: UserInput): Promise<User | null>;
}
