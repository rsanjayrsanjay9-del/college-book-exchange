import Common "common";

module {
  public type NotificationId = Nat;

  public type Notification = {
    id : NotificationId;
    interestId : Common.InterestId;
    bookId : Common.BookId;
    buyerId : Common.UserId;
    buyerName : Text;
    buyerEmail : Text;
    buyerPhone : Text;
    bookTitle : Text;
    createdAt : Common.Timestamp;
    isRead : Bool;
  };
};
