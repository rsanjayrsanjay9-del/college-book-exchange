import Common "common";

module {
  public type Interest = {
    id : Common.InterestId;
    bookId : Common.BookId;
    buyerId : Common.UserId;
    createdAt : Common.Timestamp;
  };

  public type InterestWithDetails = {
    id : Common.InterestId;
    bookId : Common.BookId;
    buyerId : Common.UserId;
    buyerName : Text;
    buyerEmail : Text;
    buyerPhone : Text;
    bookTitle : Text;
    createdAt : Common.Timestamp;
  };
};
