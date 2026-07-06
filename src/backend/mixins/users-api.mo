import Debug "mo:core/Debug";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Types "../types/users";
import Common "../types/common";
import UserLib "../lib/users";
import Time "mo:core/Time";
import Int "mo:core/Int";

mixin (
  users : Map.Map<Common.UserId, Types.User>,
) {
  public shared ({ caller }) func registerUser(input : Types.UserInput) : async Types.User {
    let now = Time.now().toNat();
    UserLib.registerUser(users, caller, input, now);
  };

  public query func getUser(id : Common.UserId) : async ?Types.User {
    UserLib.getUser(users, id);
  };

  public query ({ caller }) func getMyProfile() : async ?Types.User {
    UserLib.getUser(users, caller);
  };

  public shared ({ caller }) func updateMyProfile(input : Types.UserInput) : async ?Types.User {
    UserLib.updateUser(users, caller, input);
  };

  public shared ({ caller }) func updateUser(id : Common.UserId, input : Types.UserInput) : async ?Types.User {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    UserLib.updateUser(users, id, input);
  };

  public query func listUsers() : async [Types.User] {
    UserLib.listUsers(users);
  };

  public shared ({ caller }) func deleteUser(id : Common.UserId) : async Bool {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    UserLib.deleteUser(users, id);
  };

  public shared ({ caller }) func setAdmin(id : Common.UserId, admin : Bool) : async ?Types.User {
    // Admin is now email-based; this is a no-op
    ignore (id, admin);
    null;
  };
};
