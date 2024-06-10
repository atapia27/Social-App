/* create interfaces for the data that will be sent to the API:
interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  comments: string[];
} */


export interface Video {
    id: string;
    title: string;
    description: string;
    url: string;
    comments: string[];
}