import { SocialValues } from "~/src/components/SocialsCard";


export type NameCardType = {
  name: string;
  bio: string;
};


// Define a unified payload type (partial while the user progresses)
export type ProfilePayload = Partial<NameCardType & SocialValues> & {
  imageUri?: string;
};
