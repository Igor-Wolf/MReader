import { CharCount } from "../../utils/caracterCounter";
import { HeaderBox, HeaderTitle, TopBox } from "./styles";

export default function HeaderLib({ name }: any) {
  return (
    <>
      <HeaderBox>
        <TopBox>
          <HeaderTitle>{CharCount(name)}</HeaderTitle>
        </TopBox>
      </HeaderBox>
    </>
  );
}
