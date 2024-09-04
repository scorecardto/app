import { useCallback, useContext } from "react";
import BottomSheetContext from "../BottomSheet/BottomSheetContext";
import ClubEmailPrompt from "../../app/clubs/ClubEmailPrompt";
import { validate } from "email-validator";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { setPreferredEmail } from "../../core/state/social/socialSlice";
import ScorecardModule from "../../../lib/expoModuleBridge";
import { RootState, store } from "../../core/state/store";
function useGetEmail() {
  const sheets = useContext(BottomSheetContext);
  const dispatch = useDispatch();

  const save = useCallback((c: string) => {
    dispatch(setPreferredEmail(c));
    ScorecardModule.storeItem("preferredEmail", c);
  }, []);

  const create = useCallback(() => {
    return new Promise<string>((resolve, reject) => {
      sheets?.addSheet(({ close }) => {
        return (
          <ClubEmailPrompt
            onFinish={(email) => {
              const isValid = validate(email.toLowerCase());

              if (isValid) {
                close();
                resolve(email.toLowerCase());
              } else {
                Toast.show({
                  type: "info",
                  text1: "Please use a valid email!",
                });
              }
            }}
          />
        );
      });
    });
  }, []);

  //   const preferredEmail = useSelector((r: RootState) => r.social.preferredEmail);

  const run = useCallback(async (): Promise<string> => {
    const preferredEmail = store.getState().social.preferredEmail;

    console.log("preferred", preferredEmail);

    if (preferredEmail && validate(preferredEmail)) {
      return preferredEmail.toLowerCase();
    }

    const email = await create();
    await save(email);
    return email;
  }, [create, save]);

  return run;
}
export default useGetEmail;
