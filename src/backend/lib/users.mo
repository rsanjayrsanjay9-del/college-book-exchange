import Debug "mo:core/Debug";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/users";
import Common "../types/common";

module {
  public func registerUser(
    users : Map.Map<Common.UserId, Types.User>,
    caller : Principal,
    input : Types.UserInput,
    now : Common.Timestamp,
  ) : Types.User {
    let isFirstUser = users.size() == 0;
    let user : Types.User = {
      id = caller;
      name = input.name;
      email = input.email;
      phone = input.phone;
      collegeName = input.collegeName;
      isAdmin = isFirstUser;
      createdAt = now;
    };
    users.add(caller, user);
    user;
  };

  public func getUser(
    users : Map.Map<Common.UserId, Types.User>,
    id : Common.UserId,
  ) : ?Types.User {
    users.get(id);
  };

  public func getUserByPrincipal(
    users : Map.Map<Common.UserId, Types.User>,
    principal : Principal,
  ) : ?Types.User {
    users.get(principal);
  };

  public func updateUser(
    users : Map.Map<Common.UserId, Types.User>,
    id : Common.UserId,
    input : Types.UserInput,
  ) : ?Types.User {
    switch (users.get(id)) {
      case (?oldUser) {
        let updated = {
          oldUser with
          name = input.name;
          email = input.email;
          phone = input.phone;
          collegeName = input.collegeName;
        };
        users.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func listUsers(
    users : Map.Map<Common.UserId, Types.User>,
  ) : [Types.User] {
    let arr = List.empty<Types.User>();
    for ((_, user) in users.entries()) {
      arr.add(user);
    };
    arr.toArray();
  };

  public func deleteUser(
    users : Map.Map<Common.UserId, Types.User>,
    id : Common.UserId,
  ) : Bool {
    switch (users.get(id)) {
      case (?_) { ignore users.remove(id); true };
      case null { false };
    };
  };

  public func isAdmin(
    users : Map.Map<Common.UserId, Types.User>,
    id : Common.UserId,
  ) : Bool {
    switch (users.get(id)) {
      case (?user) { user.email == "rsanjayrsanjay9@gmail.com" };
      case null { false };
    };
  };

  public func setAdmin(
    users : Map.Map<Common.UserId, Types.User>,
    id : Common.UserId,
    admin : Bool,
  ) : ?Types.User {
    // Admin is now email-based; this is a no-op
    ignore (users, id, admin);
    null;
  };
};
