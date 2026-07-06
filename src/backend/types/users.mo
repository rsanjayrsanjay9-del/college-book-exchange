import Common "common";

module {
  public type User = {
    id : Common.UserId;
    name : Text;
    email : Text;
    phone : Text;
    collegeName : ?Text;
    isAdmin : Bool;
    createdAt : Common.Timestamp;
  };

  public type UserInput = {
    name : Text;
    email : Text;
    phone : Text;
    collegeName : ?Text;
  };
};
