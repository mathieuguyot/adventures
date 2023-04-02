import "@testing-library/jest-dom/extend-expect";
import { extractLatLongImagesFromText } from "./adventure";

describe("Adventure Models", () => {
    it("extractImgFromText single image", () => {
        const md =
            '<img style="width: 40%" alt="toto" lat="45.233" long="53.112" src="http://leafletjs.com/examples/custom-icons/leaf-green.png"/>';
        expect(extractLatLongImagesFromText(md)).toEqual([
            {
                name: "toto",
                latitude: 45.233,
                longitude: 53.112,
                src: "http://leafletjs.com/examples/custom-icons/leaf-green.png"
            }
        ]);
    });

    it("extractImgFromText multiple images", () => {
        const md =
            '<div style="display: flex; gap: 20px; justify-content: center">\
                <img style="width: 40%" alt="toto" lat="45" long="53" src="first"/>\
                <img alt="tata" lat="1" style="width: 40%" long="2" src="second"/>\
            </div>';
        expect(extractLatLongImagesFromText(md)).toEqual([
            {
                name: "toto",
                latitude: 45,
                longitude: 53,
                src: "first"
            },
            {
                name: "tata",
                latitude: 1,
                longitude: 2,
                src: "second"
            }
        ]);
    });

    it("extractImgFromText missing field", () => {
        const md = '<img style="width: 40%" lat="45.233" long="53.112" src="source"/>';
        expect(extractLatLongImagesFromText(md)).toEqual([]);
    });

    it("extractImgFromText bad latitude", () => {
        const md =
            '<img style="width: 40%"  alt="toto" lat="45.233COUCOU" long="3.112" src="source"/>';
        expect(extractLatLongImagesFromText(md)).toEqual([]);
    });
});
