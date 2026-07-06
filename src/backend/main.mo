import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinViews "mo:caffeineai-data-viewer/MixinViews";

import CommonTypes "types/common";
import UserTypes "types/users";
import BookTypes "types/books";
import InterestTypes "types/interests";
import NotificationTypes "types/notifications";

import UsersApi "mixins/users-api";
import BooksApi "mixins/books-api";
import InterestsApi "mixins/interests-api";
import AdminApi "mixins/admin-api";
import NotificationsApi "mixins/notifications-api";

actor {
  var users : Map.Map<CommonTypes.UserId, UserTypes.User>;
  var books : Map.Map<CommonTypes.BookId, BookTypes.Book>;
  var interests : Map.Map<CommonTypes.InterestId, InterestTypes.Interest>;
  var notifications : Map.Map<NotificationTypes.NotificationId, NotificationTypes.Notification>;
  var nextBookId : { var value : CommonTypes.BookId };
  var nextInterestId : { var value : CommonTypes.InterestId };
  var nextNotificationId : { var value : NotificationTypes.NotificationId };

  include MixinViews();
  include UsersApi(users);
  include BooksApi(books, nextBookId, users);
  include InterestsApi(interests, nextInterestId, users, books, notifications, nextNotificationId);
  include AdminApi(users, books, interests);
  include NotificationsApi(users, books, interests, notifications, nextNotificationId);
};
