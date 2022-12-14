export default interface Pagination {
  paging: Paging;
}

interface Paging {
  next: Next;
}

interface Next {
  after: string;
  link: string;
}
