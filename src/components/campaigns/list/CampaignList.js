import React, { useState } from "react";
import { AppContext } from "../../../contexts/context";
import CampaignItem from "../item/CampaignItem";
import CampaignForm from "../form/CampaignForm";
import { CampListContainer } from "./styled";

function CampaignList() {
  const { campaigns, user } = React.useContext(AppContext).state;
  const [create, setCreate] = useState(false);
  const { rawList } = campaigns;

  const list = rawList.map((item) => (
    <React.Fragment key={item.id}>
      <CampaignItem campaign={item} />
    </React.Fragment>
  ));

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CampListContainer>
      {list}
      <button
        onClick={() => setCreate(true)}
        className="camp-add-btn"
        data-testid="campaign-add-button"
      >
        Start a new Campaign
      </button>
      {create && <CampaignForm working={setCreate} />}
    </CampListContainer>
  );
}

export default CampaignList;
