namespace MyRoutine.Web.ViewModels
{
    public class GridFiltersViewModel
    {
        public GridFiltersViewModel()
        {
            Page = 1;
            PageSize = 10;
        }

        public string Search { get; set; }
        public string SearchAdditional { get; set; }
        public byte? SearchEnum { get; set; }
        public string SortColumn { get; set; }
        public bool SortDirectionIsAscending { get; set; }
        public short Page { get; set; }
        public byte PageSize { get; set; }
        public int ItemCount { get; set; }
    }
}