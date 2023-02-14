export type Applicant = {
  id: string;
  name: string;
  image: string;
  profileLink?: string;
  applyDate: string;
  coverLetter: string;
};

export type ApplicantListProps = {
  list: Applicant[];
  hireable: boolean;
};