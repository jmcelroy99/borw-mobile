import global from 'src/utils/global';
import { Share } from 'react-native';
import { INVITE_LINK } from 'src/config/api';
import { useState } from 'react';

const useInviteFriendFacade = (t) => {
  const [user, ] = useState(global.getUser())

  const _onShareLink = async () => {
    const result = await Share.share(
      {
        title: t('invites:text_invite'),
        subject: t('invites:text_invite'),
        message: t('invites:text_invite2') + ' ' + user.invitationCode + ' :' + INVITE_LINK,
        url: INVITE_LINK,
      }, {
      dialogTitle: t('invites:text_invite_title'),
      tintColor: 'green',
      excludedActivityTypes: [
        'com.apple.UIKit.activity.Print',
        'com.apple.UIKit.activity.SaveToCameraRoll',
        'com.apple.UIKit.activity.AddToReadingList',
        'com.apple.UIKit.activity.PostToVimeo',
        'com.apple.UIKit.activity.AirDrop',
        'com.apple.UIKit.activity.OpenInIBooks',
        'com.apple.reminders.RemindersEditorExtension',
        'com.apple.mobileslideshow.StreamShareService',
      ],
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('shared with activity type of '+ result.activityType);
      } else {
        console.log('shared');
      }
          
    } else if (result.action === Share.dismissedAction) {
        Console.log('dismissed');
    }
  }

  return {
    user,
    _onShareLink
  }
}

export {
  useInviteFriendFacade,
}
