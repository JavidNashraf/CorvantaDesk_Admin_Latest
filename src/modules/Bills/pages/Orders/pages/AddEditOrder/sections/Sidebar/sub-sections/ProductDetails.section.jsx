import { MultiSelect } from 'components';
import { useSelector } from 'react-redux';

export const ProductDetails = () => {
  const { categories } = useSelector((state) => state?.categories);
  const { departments } = useSelector((state) => state.departments);

  return (
    <div className="p-[32px] bg-[#000000] rounded-[8px] mt-[20px]">
      <h6 className="text-white font-medium text-[16px]">ProductDetails</h6>
      <p className="text-[#474761] text-[14x] mt-[8px] mb-[32px]">
        Set Categories & Tags
      </p>
      <MultiSelect
        name="orderTemplateCategories"
        placeholder="Select Categories"
        label="Cateogries"
        options={categories?.map((category) => ({
          label: category?.name,
          value: category?.id,
        }))}
      />
      {/* <Button type="ghost" className="mt-[16px] mb-[32px] w-full h-[52px]">
        Add New Category
      </Button> */}
      <MultiSelect
        name="orderTemplateDepartments"
        placeholder="Select Departments"
        label="Departments"
        options={departments?.map((department) => ({
          label: department?.name,
          value: department?.id,
        }))}
      />
      <MultiSelect
        name="tags"
        placeholder="Enter New Tag"
        label="Tags"
        mode="tags"
      />
    </div>
  );
};
