import Card from "./Card";

const Team = () => {
  return (
    <div className="my-12 ">
      <h1 className="text-5xl text-sky-900 text-center my-16 ">
        <b>Team Members</b>
      </h1>

      <div className="flex overflow-x-auto space-x-4 px-4 scrollbar-hidden gap-4">
        {/* <Card logo="SM" name="Ms. Sayani Manna" degree="Assistant Professor" college="Maulana Abul Kalam Azad University Of Technology" place="Kalyani, WB" /> */}
        <Card
          logo="SP"
          name="Shreyo Paul"
          degree="B.TECH (IT)"
          college="Maulana Abul Kalam Azad University Of Technology"
          place="Kalyani, WB"
        />
        <Card
          logo="RS"
          name="Rohit Singh"
          degree="B.TECH (IT)"
          college="Maulana Abul Kalam Azad University Of Technology"
          place="Kalyani, WB"
        />
        <Card
          logo="RM"
          name="Rahul Modak"
          degree="B.TECH (IT)"
          college="Maulana Abul Kalam Azad University Of Technology"
          place="Kalyani, WB"
        />
        <Card
          logo="IB"
          name="Indrajit Banerjee"
          degree="B.TECH (IT)"
          college="Maulana Abul Kalam Azad University Of Technology"
          place="Kalyani, WB"
        />
        <Card
          logo="TG"
          name="Tilak Ghosh"
          degree="B.TECH (IT)"
          college="Maulana Abul Kalam Azad University Of Technology"
          place="Kalyani, WB"
        />
      </div>
    </div>
  );
};

export default Team;
