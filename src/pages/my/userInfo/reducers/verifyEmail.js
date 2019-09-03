export default function (state, action) {
  switch (action.type) {
    case 'SENDMAIL_INIT':
      return {
        ...state,
        disableSendMail: true,
        isLoading: true,
      };
    case 'SENDMAIL_SUCCESS':
      return {
        ...state,
        isSend: true,
        disableSubmit: false,
        isLoading: false,
      };
    case 'SENDMAIL_FAIL':
      return {
        ...state,
        disableSendMail: false,
        isLoading: false,
      };
    case 'SENDMAIL_TIMEOUT': // 倒计时结束，可以重新发送邮件
      return {
        ...state,
        isSend: false,
        disableSendMail: false,
      };
    case 'VERIFY_INIT':
      return {
        ...state,
        isLoading: true,
        captchaErr: false,
      };
    case 'VERIFY_SUCCESS':
      return {
        ...state,
        isLoading: false,
        captchaErr: false,
      };
    case 'VERIFY_FAIL':
      return {
        ...state,
        isLoading: false,
        captchaErr: true,
      };
    default:
      throw new Error();
  }
}
